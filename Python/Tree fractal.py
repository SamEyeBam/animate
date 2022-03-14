import turtle
MINIMUM_BRANCH_LENGTH = 5
def build_tree(t, branch_length, shorten_by, angle, c):
  if branch_length > MINIMUM_BRANCH_LENGTH:
    t.pendown()
    t.color(c)
    t.forward(branch_length)
    
    new_length = branch_length - shorten_by
    t.left(angle)
    build_tree(t, new_length, shorten_by, angle, "#8a1cff")
    t.right(angle * 2)
    
    build_tree(t, new_length, shorten_by, angle, "#ff7e1c")
    t.left(angle)
    
    t.penup()
    t.backward(branch_length)
    
tree = turtle.Turtle()
tree.hideturtle()
tree.speed(0)
tree.setheading(90)
tree.color('green')
turtle.bgcolor("black")
build_tree(tree, 40, 3, 15, "red")
turtle.mainloop()