from langchain_core.tools import tool
from tavily import TavilyClient

@tool
def web_search(query: str) -> dict:
    """
    Search the web for the given query using Tavily API.

    Args:
        query (str): The query to search for.
    
    Returns:
        dict: A dictionary containing the following search results.
            - url (str): The URL of the search result.
            - content (str): The content of the search result.

    """
    client = TavilyClient()
    return client.search(query)