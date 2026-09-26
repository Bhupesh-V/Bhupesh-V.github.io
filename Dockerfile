# ---- Builder: compile gems (needs build tools) ----
FROM ruby:3.1-slim AS builder

ENV LANG=C.UTF-8 \
    BUNDLE_PATH=/usr/local/bundle

RUN apt-get update -qq && apt-get install -y --no-install-recommends \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY Gemfile Gemfile.lock ./
RUN gem install bundler:1.17.2 && bundle install

# ---- Runtime: slim image, no build tools ----
FROM ruby:3.1-slim

ENV LANG=C.UTF-8 \
    BUNDLE_PATH=/usr/local/bundle

WORKDIR /usr/src/app

COPY --from=builder /usr/local/bundle /usr/local/bundle

# Copy site files
COPY . .

# Build the site (optional)
# RUN bundle exec jekyll build

# Serve the site
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]

# Expose port
EXPOSE 4000
