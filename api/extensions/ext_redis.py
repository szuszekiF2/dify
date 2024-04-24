import os

import redis
from redis.connection import Connection, SSLConnection

redis_client = redis.Redis(
    host=os.environ.get('REDIS_HOST', 'localhost'),
    port=os.environ.get('REDIS_PORT', 6379),
    username=os.environ.get('REDIS_USERNAME'),
    password=os.environ.get('REDIS_PASSWORD')
)


def init_app(app):
    connection_class = Connection
    if app.config.get('REDIS_USE_SSL', False):
        connection_class = SSLConnection

    redis_client.connection_pool = redis.ConnectionPool(**{
        'host': app.config.get('REDIS_HOST', 'localhost'),
        'port': app.config.get('REDIS_PORT', 6379),
        'username': app.config.get('REDIS_USERNAME', None),
        'password': app.config.get('REDIS_PASSWORD', None),
        'db': app.config.get('REDIS_DB', 0),
        'encoding': 'utf-8',
        'encoding_errors': 'strict',
        'decode_responses': False
    }, connection_class=connection_class)

    app.extensions['redis'] = redis_client
