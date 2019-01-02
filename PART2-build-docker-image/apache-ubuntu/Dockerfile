FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y apache2
WORKDIR /var/www/html
RUN echo "<h1>I-scream edu</h1>" > eng.html
ADD index.html .
EXPOSE 80

CMD ["apachectl", "-DFOREGROUND"]