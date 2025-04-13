FROM ruby:3.1

# Set environment variables
ENV LANG=C.UTF-8

# Install dependencies
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  nodejs \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install gems
RUN gem install bundler:1.17.2 && bundle install

# Copy site files
COPY . .

# Build the site (optional)
# RUN bundle exec jekyll build

# Serve the site
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]

# Expose port
EXPOSE 4000
