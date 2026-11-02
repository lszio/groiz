# The Groiz workspace: static Astro build, one origin, no backend. The
# playground simulates the provider (scripted, like the repo's contract
# tests) and says so on the page; the loop logic it walks through is the
# repository's real source. The stock nginx default.conf already serves
# /usr/share/nginx/html — removing it would leave nginx no server block.
# Build context = site/ (dokploy dockerContextPath), so the project root
# maps to /src directly.
FROM oven/bun:1 AS build
COPY . /src
WORKDIR /src
RUN bun install --frozen-lockfile && bun run build

FROM nginx:1.27-alpine
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 80
