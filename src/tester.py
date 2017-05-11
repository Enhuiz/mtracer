#%%
import numpy as np

a = np.array([[1123.214, 2.124], [3.124, 4.124]])
b = np.array([[5.1234, 6.1234], [7.124, 8.5324]])
print(a)
print(b)
print(a + b)
print(a - b)
print(a * b)
print(np.dot(a, b))
print(b.T)
print(np.sum(b, 1))