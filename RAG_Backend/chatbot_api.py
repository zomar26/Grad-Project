from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_engine import generate_answer

app = FastAPI(title="RAG Medical Chatbot API")

# Allow React and .NET frontends to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",   # React default
                   "http://localhost:5173",   # Vite React
                   "http://localhost:5000",   # .NET default
                   "http://localhost:7000"],  # .NET HTTPS
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str
    need_doctor: bool = True

class ChatResponse(BaseModel):
    answer: str

@app.get("/")
def root():
    return {"status": "RAG Chatbot API is running ✅"}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    answer = generate_answer(request.query, request.need_doctor)
    return ChatResponse(answer=answer)