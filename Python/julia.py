import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

import time
#from matplotlib import cm
#from matplotlib.colors import ListedColormap, LinearSegmentedColormap

#ncmap = cm.get_cmap('magma', 400)


def julia_quadratic(zx, zy, cx, cy, threshold):
    """Calculates whether the number z[0] = zx + i*zy with a constant c = x + i*y
    belongs to the Julia set. In order to belong, the sequence 
    z[i + 1] = z[i]**2 + c, must not diverge after 'threshold' number of steps.
    The sequence diverges if the absolute value of z[i+1] is greater than 4.
    
    :param float zx: the x component of z[0]
    :param float zy: the y component of z[0]
    :param float cx: the x component of the constant c
    :param float cy: the y component of the constant c
    :param int threshold: the number of iterations to considered it converged
    """
    # initial conditions
    z = complex(zx, zy)
    c = complex(cx, cy)
    
    for i in range(threshold):
        z = z**2 + c
        if abs(z) > 4.:  # it diverged
            return i
        
    return threshold - 1  # it didn't diverge


x_start, y_start = -2, -2  # an interesting region starts here
width, height = 4, 4  # for 4 units up and right
density_per_unit = 200  # how many pixles per unit

# real and imaginary axis
re = np.linspace(x_start, x_start + width, width * density_per_unit )
im = np.linspace(y_start, y_start + height, height * density_per_unit)


threshold = 100  # max allowed iterations
frames = 15  # number of frames in the animation

# we represent c as c = r*cos(a) + i*r*sin(a) = r*e^{i*a}
r = 0.7885
a = np.linspace(0, 2*np.pi, frames)

fig = plt.figure(figsize=(10, 10))  # instantiate a figure to draw
ax = plt.axes()  # create an axes object

def animate(i):
    start = time.time()
    n = i
    ax.clear()  # clear axes object
    ax.set_xticks([])  # clear x-axis ticks
    ax.set_yticks([])  # clear y-axis ticks

    X = np.empty((len(re), len(im)))  # the initial array-like image
    cx, cy = r * np.cos(a[i]), r * np.sin(a[i])  # the initial c number

    # iterations for the given threshold
    for i in range(len(re)):
        for j in range(len(im)):
            X[i, j] = julia_quadratic(re[i], im[j], cx, cy, threshold)

    img = ax.imshow(X.T, interpolation="bicubic", cmap="magma")
    
    end = time.time()
    diff = end - start
    global total_time
    total_time += diff
    ave = total_time/(n+1)
    print(f"time[{n}]: {diff:.3f} ETA: {((frames - n+1)* ave)/60:.2f}")    
    return [img]

start = time.time()

total_time = 0
print("start")

anim = animation.FuncAnimation(fig, animate, frames=frames, interval=1, blit=True)
#writervideo = animation.FFMpegWriter(fps=60) 
#anim.save('julia_set_vid.mp4', writer=writervideo)
anim.save('julia_set_ahhhh.mp4', writer='imagemagick')
print("done")