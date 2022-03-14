import turtle
import math


turtle.colormode(255)

fac = .01
a=0
b=1

sqr = math.sqrt(5)

c= 1/sqr
d= (1+sqr)/2
e = (1-sqr)/2
j = 10

j_max = 30

turtle.bgcolor("black")


def fibb(t, col):
    global b
    global j
    global j_max
    global c
    global d
    global e
    
    
    coll = math.radians(col)
    print(col)
    print(255*coll)
    print(round(255*coll))    
    
    if coll >1:
        coll = 1
    if coll <0:
        coll = 0    
    t.pencolor((round(255* coll),0,192))
    
    for j in range(10, j_max):
        f=math.pi * b * fac /2
        f /= 90
        for i in range(90):
            turt.forward(f)
            turt.left(1)
        
        b = c * ((d**j)- (e**j))
        
    t.penup()
turt = turtle.Turtle()
turt.speed(0)

for ang in range(360):
    turt.setx(0)
    turt.sety(0)
    turt.left(1)
    turt.pendown()
    a=0
    b=1
    print(ang)
    if ang>179:
        ang = ang - 179
    fibb(turt, ang)

cv = turt.getcanvas()
cv.postscript(file="file_name.ps", colormode='color')

turtle.done()
    
    