FROM python:3

RUN pip install discord-py-interactions python-dotenv

CMD ["python", "src/"]
