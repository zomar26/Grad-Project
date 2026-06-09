import faiss
import numpy as np
import pandas as pd
import torch
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Load RAG assets ──────────────────────────────────────────
index = faiss.read_index(os.path.join(BASE_DIR, "assets", "medical_chatbot_index.faiss"))
df = pd.read_csv(os.path.join(BASE_DIR, "assets", "cleaned_medical_data.csv"))
metadata = pd.read_csv(os.path.join(BASE_DIR, "assets", "metadata.csv"))
embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# ── Load LLM  ───────────────────
model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    dtype=torch.float32,
    trust_remote_code=True,
    device_map="cpu"
)

# ── RAG Query ────────────────────────────────────────────────
def generate_answer(query: str, need_doctor: bool = True, k: int = 2) -> str:
    query_embedding = embedder.encode([query])
    _, indices = index.search(np.array(query_embedding), k)
    results = df.iloc[indices[0]]

    context = "\n\n".join(
        [
            f"Patient: {row['Patient']}\nDoctor: {row['Doctor']}"
            for _, row in results.iterrows()
        ]
    )

    mode = (
        "Use accurate medical terms, but keep it short."
        if need_doctor
        else
        "Use simple everyday language. Avoid medical jargon."
    )

    prompt = f"""You are a medical RAG assistant.
    Answer questions about medical conditions and treatments.
Use only the context below.
Keep the answer short: 3 to 5 bullet points only.
Do not repeat the question.
Do not write long explanations.
If the context is not enough, say so briefly.

Mode: {mode}

Context:
{context}

Question:
{query}

Answer:
"""

    inputs = tokenizer(
        [prompt],
        return_tensors="pt",
        truncation=True,
        max_length=1024
    ).to(model.device)

    with torch.inference_mode():
        outputs = model.generate(
            **inputs,
            max_new_tokens=120,
            do_sample=False,
            num_beams=1,
            use_cache=True,
            repetition_penalty=1.05,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id
        )

    input_tokens = inputs["input_ids"].shape[1]
    answer_only = outputs[0][input_tokens:]

    return tokenizer.decode(answer_only, skip_special_tokens=True).strip()