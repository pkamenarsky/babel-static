module Static where

data Static a = Static String

static_ptr :: forall a. a -> Static a
static_ptr _ = Static "__stptr_undefined"

test :: Static (Int -> Int)
test = static_ptr \a -> a
