from turtle import *
r = 1
g = 0
b = 0
tup = (r,g,b)
pencolor(tup) 
change_amount = 0.1
changing_color = "r+"

#begin_fill()
pendown()



def step_color_rainbow():
    
    global changing_color
    global change_amount
    global r
    global g
    global b
    if(changing_color == "r+"):
        r += change_amount
        if(r>1):
            r = 1
            changing_color = "b-"        
    elif(changing_color == "g+"):
        g += change_amount
        if(g>1):
            g = 1
            changing_color = "r-"
    elif(changing_color == "b+"):
        b += change_amount
        if(b>1):
            b = 1
            changing_color = "g-"         
    if(changing_color == "r-"):
        r -= change_amount
        if(r<0):
            r = 0
            changing_color = "b+"        
    elif(changing_color == "g-"):
        g -= change_amount
        if(g<0):
            g = 0
            changing_color = "r+"         
    elif(changing_color == "b-"):
        b -= change_amount
        if(b<0):
            b = 0
            changing_color = "g+"        
    







def step_color_two():
    global r
    global g
    global b
    global changing_color
    
    r1 = 0.07
    g1 = 0.02
    b1 = 0.35
    
    r2 = 1
    g2 = 0.07
    b2 = 0.31
    
    
    c_amount = 100
    
    rdiff = r2-r1
    gdiff = g2 - g1
    bdiff = b2 - b1
    
    rchange = rdiff/c_amount
    gchange = gdiff/c_amount
    bchange = bdiff/c_amount
    #print(f"{rchange} {gchange} {bchange}")
    #print(f" {r} {g} {b}")
    if(changing_color == "r+"):
        r += rchange
        g += gchange
        b += bchange
    else:
        r -= rchange
        g -= gchange
        b -= bchange
        
    if(r >= r2):
        r = r2
        g = g2
        b = b2
        changing_color = "r-"
    elif(r <= r1):
        r = r1
        g = g1
        b = b1
        changing_color = "r+"    
    
nodes = 999
step = 330
node_angle = 360/nodes
speed(0)
bgcolor("black")
def iterations(n,s):
    i = 1
    while True:
        x = s*i
        if(x % n== 0) and (x>= n):
            return i
        else:
            i += 1

#print(iterations(nodes,step))
distance = 1
speed = 0
while True:
    forward(distance)
    right(step*node_angle)
    if abs(pos()) < 1:
        break
    
    step_color_two()
    #step_color_rainbow()
    #print(f"{r} {g} {b}")
    pencolor((r,g,b))
    distance +=1
done()