from pathlib import Path

def load_documents():

    root = Path("../Back-End/ProjectGrad_API/Data/EyeDiseases")
    docs = []

    for file in root.rglob("*.md"):

        try:
            content = file.read_text(
                encoding="utf-8"
            )

            docs.append({
                "path": str(file),
                "content": content
            })

        except Exception:
            pass

    return docs