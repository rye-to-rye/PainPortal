var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine = Engine.create();

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// Walls
var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 30, window.innerWidth, 60, { isStatic: true });
var leftWall = Bodies.rectangle(-30, window.innerHeight / 2, 60, window.innerHeight * 2, { isStatic: true });
var rightWall = Bodies.rectangle(window.innerWidth + 30, window.innerHeight / 2, 60, window.innerHeight * 2, { isStatic: true });
var ceiling = Bodies.rectangle(window.innerWidth / 2, -30, window.innerWidth, 60, { isStatic: true });

// PASSWORD = physics body
var passwordBody = Bodies.rectangle(300, 100, 220, 40, {
  restitution: 0.8,
  friction: 0.1,
  density: 0.001,
  render: {
    visible: false  // 🚀 hides the yellow rectangle completely
  }
});


// Cats
var catBody = Bodies.rectangle(500, 300, 100, 100, {
  restitution: 0.6,
  friction: 0.1,
  density: 0.01,
  render: {
    sprite: {
      texture: 'images/catStand-removebg-preview.png',
      xScale: 0.8,
      yScale: 0.8
    }
  }
});

var catBody2 = Bodies.rectangle(300, 350, 100, 100, {
  restitution: 0.6,
  friction: 0.1,
  density: 0.01,
  render: {
    sprite: {
      texture: 'images/catStand-removebg-preview.png',
      xScale: 0.8,
      yScale: 0.8
    }
  }
});

// Flying cat
var flyingCat = Bodies.rectangle(200, 200, 100, 100, {
  restitution: 1.0,
  frictionAir: 0.0001,
  friction: 0,
  density: 0.001,
  render: {
    sprite: {
      texture: 'images/nyan_cat.png',
      xScale: 0.7,
      yScale: 0.7
    }
  }
});

Matter.Body.setInertia(flyingCat, Infinity);

// Add bodies to world
Composite.add(engine.world, [
  ground, leftWall, rightWall, ceiling,
  passwordBody,
  catBody,
  catBody2,
  flyingCat
]);

// Cat AI
function controlCat(cat) {
  var action = Math.random();

  if (action < 0.4) {
    var dx = passwordBody.position.x - cat.position.x;
    var dy = passwordBody.position.y - cat.position.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    Matter.Body.applyForce(cat, cat.position, {
      x: (dx / dist) * 0.04,
      y: (dy / dist) * 0.04
    });
  }

  else if (action < 0.7) {
    Matter.Body.applyForce(cat, cat.position, {
      x: (Math.random() - 0.5) * 0.06,
      y: -0.12
    });
  }

  else if (action < 0.9) {
    Matter.Body.setVelocity(cat, {
      x: (Math.random() - 0.5) * 100,
      y: cat.velocity.y
    });
  }

  else {
    var dx = passwordBody.position.x - cat.position.x;
    Matter.Body.applyForce(cat, cat.position, {
      x: dx * 0.005,
      y: -0.1
    });
  }
}

setInterval(function() {
  controlCat(catBody);
  controlCat(catBody2);
}, 400);

// Flying cat AI
setInterval(function () {
  Matter.Body.applyForce(flyingCat, flyingCat.position, {
    x: (Math.random() - 0.5) * 0.2,
    y: (Math.random() - 0.5) * 0.2
  });

  if (Math.random() < 0.2) {
    Matter.Body.setVelocity(flyingCat, {
      x: (Math.random() - 0.5) * 50,
      y: (Math.random() - 0.5) * 50
    });
  }

}, 200);

// Random jitter for grounded cats
Matter.Events.on(engine, 'beforeUpdate', function() {
  [catBody, catBody2].forEach(cat => {
    if (Math.random() > 0.97) {
      Matter.Body.setVelocity(cat, {
        x: cat.velocity.x + (Math.random() - 0.5) * 8,
        y: cat.velocity.y
      });
    }
  });
});

// Collision push for password box
Matter.Events.on(engine, 'collisionStart', function(event) {
  var pairs = event.pairs;

  pairs.forEach(pair => {
    [catBody, catBody2, flyingCat].forEach(cat => {

      if ((pair.bodyA === cat && pair.bodyB === passwordBody) ||
          (pair.bodyA === passwordBody && pair.bodyB === cat)) {

        var dx = passwordBody.position.x - cat.position.x;
        var dy = passwordBody.position.y - cat.position.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        Matter.Body.applyForce(passwordBody, passwordBody.position, {
          x: (dx / dist) * 50,
          y: (dy / dist) * 50 - 0.05
        });

        Matter.Body.setAngularVelocity(passwordBody, (Math.random() - 0.5) * 0.3);
      }
    });
  });
});

// Resize handler
window.addEventListener('resize', function() {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;

  Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight - 30 });
  Matter.Body.setVertices(ground, Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 30, window.innerWidth, 60).vertices);

  Matter.Body.setPosition(leftWall, { x: -30, y: window.innerHeight / 2 });
  Matter.Body.setVertices(leftWall, Matter.Bodies.rectangle(-30, window.innerHeight / 2, 60, window.innerHeight * 2).vertices);

  Matter.Body.setPosition(rightWall, { x: window.innerWidth + 30, y: window.innerHeight / 2 });
  Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(window.innerWidth + 30, window.innerHeight / 2, 60, window.innerHeight * 2).vertices);

  Matter.Body.setPosition(ceiling, { x: window.innerWidth / 2, y: -30 });
  Matter.Body.setVertices(ceiling, Matter.Bodies.rectangle(window.innerWidth / 2, -30, window.innerWidth, 60).vertices);
});

// Sync DOM → physics for password box
(function update() {
  var box = document.getElementById("passwordBox");
  var pos = passwordBody.position;
  var angle = passwordBody.angle;

  box.style.left = (pos.x - 110) + "px";
  box.style.top  = (pos.y - 20) + "px";
  box.style.transform = "rotate(" + angle + "rad)";

  requestAnimationFrame(update);
})();

// Spin the username box REALLY fast in place
(function spinUsername() {
  var box = document.getElementById("searchBox");
  var angle = 0;

  function spin() {
    angle += 50; // increase speed by raising this number
    box.style.transform = "rotate(" + angle + "deg)";
    requestAnimationFrame(spin);
  }

  spin();


})();

(function spinPassword() {
  var box = document.getElementById("passwordBox");
  var angle = 0;

  function spin() {
    angle += 50; // increase speed by raising this number
    box.style.transform = "rotate(" + angle + "deg)";
    requestAnimationFrame(spin);
  }

  spin();


})();


// Run engine
Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);
