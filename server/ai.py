from config import Config
from langchain_ollama import ChatOllama

llm = ChatOllama(
    model=Config.OLLAMA_MODEL,
    validate_model_on_init=False,
    temperature=0.7,
)


def ask_ai(prompt: str) -> str:
    return llm.invoke(prompt).content