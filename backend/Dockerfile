FROM python:3.10
ADD requirements.txt /requirements.txt
ADD main.py /main.py
ADD okteto-stack.yaml /okteto-stack.yaml
RUN pip install -r requirements.txt
EXPOSE 8000
COPY ./database database
COPY ./routes routes
COPY ./model model
CMD ["python3", "main.py"]