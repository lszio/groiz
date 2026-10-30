# The Groiz landing page: static, one origin, no backend. The playground
# simulates the provider (scripted, like the repo's contract tests) and
# says so on the page; the loop logic it walks through is the repository's
# real source.
FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
