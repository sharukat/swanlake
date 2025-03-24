import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

import logging

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Load environmental variables
load_dotenv(dotenv_path="../.env")


class InitModel:
    """Manages the initialization and the access to the LLM instance."""

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(InitModel, cls).__new__(cls, *args, **kwargs)
            cls._instance.initialize_model()
        return cls._instance

    def initialize_model(self) -> None:
        """Initializes the LLM instance."""
        self.model_name = os.getenv("LLM")
        self.model = ChatOllama(
            model=self.model_name,
            temperature=0,
        )

    def get_model(self) -> ChatOllama:
        """Returns the initialized LLM instance."""
        if not hasattr(self, "model"):
            err = "The model has not been initialized."
            logger.error(err)
            raise ValueError(err)
        return self.model


class ResponseGenerator:
    """Generates a response based on user input, MongoDB data and web info."""

    def __init__(self) -> None:
        self.model_manager = InitModel()

    def generate(self, search_item: str, db_data: dict, web_data: str) -> str:
        prompt = PromptTemplate.from_template(
            """You are an expert in providing information about {search_item}
            based only on provided context.

            Follow the steps below to generate a response:
            1. Read the JSON type data provided.
            2. Provide a detailed and descriptive explanation with the tone
            of lecturing as the first part of the response only based on the
            db_data provided. In that response emphase that the data is based
            on the swanlake database.
            3. Then to generate the second part of the use the web_data
            provided. In that response emphase that the data is based on the
            web search.

            JSON Data:
            {db_data}

            Web Data:
            {web_data}
            """
        )

        chain = prompt | self.model_manager.get_model() | StrOutputParser()
        response = chain.invoke(
            {"search_item": search_item,
             "db_data": db_data,
             "web_data": web_data}
        )
        return response


class LLMService:
    """Entry point to the LLM service."""

    def __init__(self) -> None:
        self.response_generator = ResponseGenerator()

    def generate_response(
            self, search_item: str, db_data: dict, web_data: str) -> str:
        """Generates a response based on the given input."""
        return self.response_generator.generate(search_item, db_data, web_data)
