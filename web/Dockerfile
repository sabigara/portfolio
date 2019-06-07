FROM python:3.7-alpine
RUN mkdir portfolio
COPY . opt/portfolio
COPY requirements.txt opt/portfolio
WORKDIR opt/portfolio
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "portfolio.wsgi"]