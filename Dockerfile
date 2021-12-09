FROM ubuntu:20.04
LABEL maintainer="Your Name <youremailaddress@provider.com>"
RUN apt-get update -y && \
    apt-get install -y python3-pip
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN python3 -m pip install -r requirements.txt
COPY . /app
CMD ["python3", "./app.py" ]