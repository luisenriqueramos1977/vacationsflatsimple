# Use Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /holiday_flat

# Install dependencies
COPY requirements.txt /holiday_flat/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY ./holiday_flat /holiday_flat

# Expose the application port
EXPOSE 8000


