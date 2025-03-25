import os
from dotenv import load_dotenv
from functools import lru_cache
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

import logging

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Load environmental variables
load_dotenv(dotenv_path="../.env")


@lru_cache(maxsize=None)
class InitModel:
    """Manages the initialization and the access to the LLM instance.
    LRU cache is used to make the class singleton.
    """

    def __init__(self):
        self.model_name = os.getenv("LLM")
        self._model = ChatGroq(
            model=self.model_name,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            temperature=0,
        )

    @property
    def model(self) -> ChatGroq:
        """Returns the initialized LLM instance."""
        if not hasattr(self, "_model") or self._model is None:
            err = "The model has not been initialized."
            logger.error(err)
            raise ValueError(err)
        return self._model


class ResponseGenerator:
    """Generates a response based on user input, MongoDB data and web info."""

    def __init__(self) -> None:
        self.model_manager = InitModel()

    def generate(self, search_item: str, db_data: dict, web_data: str) -> str:
        prompt = PromptTemplate.from_template(
            """You are an expert in providing information about {search_item}
            based only on provided context.

            Follow the steps below to generate a response:
            1. Read the dictionary type data provided.
            2. Provide a detailed explanation as the first paragraph
            of the response only based on the db_data provided. In that
            response emphasize that the data is based on the swanlake database.
            3. Then to generate the second paragraph using the web_data
            provided. In that response emphase that the data is based on the
            web search.

            DB Data:
            {db_data}

            Web Data:
            {web_data}

            Response should be in markdown format. The ressponse should only
            contain two paragraphs (no titles or headings) separated by an
            empty new line.
            """
        )

        chain = prompt | self.model_manager.model | StrOutputParser()
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
