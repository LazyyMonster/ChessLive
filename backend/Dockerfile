FROM python:3.12.6

WORKDIR /code

# Install system dependencies required for OpenCV
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0 && rm -rf /var/lib/apt/lists/*

# Copy application files
COPY ./app /code/app
COPY requirements.txt /code/

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
