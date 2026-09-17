build:
	docker build -t bhupesh.me .
run:
	docker run --rm -p 4000:4000 \
	-v "$$PWD:/usr/src/app" \
	-v "$$PWD/_posts:/usr/src/app/_posts" \
	bhupesh.me \
	bundle exec jekyll serve --host 0.0.0.0 --config _config.yml,_config.dev.yml
