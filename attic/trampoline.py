# trampoline.py
#
# A simple of example of trampoling between coroutines

# A subroutine
def add(x,y):
    yield x+y

# A function that calls a subroutine
def main():
    r = yield add((yield add(2, 3)),1)
    print r
    yield

def run():
    m      = main()       
    # An example of a "trampoline"
    sub = m.next()        
    result = sub.next()
    sub = m.send(result)
    result = sub.next()
    m.send(result)

run()