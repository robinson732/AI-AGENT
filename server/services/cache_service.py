import json
import extensions


def cache_get(key):

    if extensions.redis_client is None:
        raise RuntimeError(
            "Redis client has not been initialized."
        )

    value = extensions.redis_client.get(key)

    if value is None:
        return None

    return json.loads(value)


def cache_set(key, value, expiration=60):

    if extensions.redis_client is None:
        raise RuntimeError(
            "Redis client has not been initialized."
        )

    extensions.redis_client.setex(
        key,
        expiration,
        json.dumps(value)
    )


def cache_delete(key):

    if extensions.redis_client is None:
        raise RuntimeError(
            "Redis client has not been initialized."
        )

    extensions.redis_client.delete(key)