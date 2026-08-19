
// Component 1: Handles ONLY the vertical bobbing
AFRAME.registerComponent('bobbing', {
  schema: {
    bobbingHeight: {type: 'number', default: 0.5},
    bobbingDuration: {type: 'number', default: 5000}
  },

  init: function () {
    const data = this.data;
    
    // We apply the bobbing to the child model, relative to the parent's starting Y
    this.el.setAttribute('animation__bob', {
      property: 'position.y', 
      from: -data.bobbingHeight, // Bobbing relative to the child's local origin (0)
      to: data.bobbingHeight,
      dir: 'alternate',
      dur: data.bobbingDuration,
      easing: 'easeInOutSine',
      loop: true
    });
  }
});


// Component 2: Handles ONLY the seamless swimming path (applied to the parent)
AFRAME.registerComponent('swim-path', {
  schema: {
    startPos: {type: 'vec3', default: {x: -30, y: 15, z: -200}},
    endPos: {type: 'vec3', default: {x: 30, y: 10, z: -10}},
    duration: {type: 'number', default: 25000},
    startRotationY: {type: 'number', default: 45},
    endRotationY: {type: 'number', default: 225}
  },

  init: function () {
    this.isForward = true;
    this.el.setAttribute('position', this.data.startPos);
    this.startSwim();
  },

  startSwim: function () {
    const data = this.data;
    const el = this.el;

    // Determine the target position and rotation
    const targetPos = this.isForward ? data.endPos : data.startPos;
    const initialRotY = this.isForward ? data.startRotationY : data.endRotationY;

    // Set rotation instantly (applied to the parent container)
    el.setAttribute('rotation', {x: 0, y: initialRotY, z: 0});

    // Start the main position animation (full X Y Z movement)
    el.setAttribute('animation__swim', {
      property: 'position',
      to: `${targetPos.x} ${targetPos.y} ${targetPos.z}`,
      dur: data.duration,
      easing: 'easeInOutSine',
      loop: false,
      dir: 'normal'
    });

    // Listen for animation completion to flip direction
    el.addEventListener('animationcomplete', this.handleAnimationComplete.bind(this), {once: true});
  },

  handleAnimationComplete: function () {
    this.isForward = !this.isForward;
    this.startSwim();
  }
});
