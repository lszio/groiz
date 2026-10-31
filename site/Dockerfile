# The Groiz landing page: static, one origin, no backend. The playground
# simulates the provider (scripted, like the repo's contract tests) and
# says so on the page; the loop logic it walks through is the repository's
# real source. The stock nginx default.conf already serves
# /usr/share/nginx/html — removing it would leave nginx no server block.
FROM nginx:1.27-alpine
COPY index.html tokens.css /usr/share/nginx/html/
EXPOSE 80
