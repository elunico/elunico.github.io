def squash(exceptions=(Exception,), onError=None):
    def delegate(fn):
        def wrapper(*args, **kwargs):
            try:
                return fn(*args, **kwargs)
            except BaseException as e:
                squashed = (exceptions if type(exceptions) is tuple
                            else tuple(exceptions))
                if isinstance(e, squashed):
                    return onError() if hasattr(onError, '__call__') else onError
                else:
                    raise
        return wrapper
    return delegate


def squash_inline(fn, exceptions=(Exception,), onError=None):
    try:
        return fn()
    except BaseException as e:
        squashed = (exceptions if type(exceptions) is tuple
                    else tuple(exceptions))
        if isinstance(e, squashed):
            return onError() if hasattr(onError, '__call__') else onError
        else:
            raise


_int = int
@squash([ValueError, TypeError])
def int(n):
    return _int(n)


_float = float
@squash([ValueError, TypeError])
def float(x):
    return _float(x)
