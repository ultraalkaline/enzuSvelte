<script>
  import { onMount, afterUpdate } from 'svelte';
  import { getRandomInt } from '$lib/HelperFunctions';

  let canvas;
  let container;
  let context;
  let fps = 20;

  export let canvasWidth;
  export let canvasHeight;
  export let placement;

  const randomColor = getRandomInt(0, 256);

  const initCanvas = () => {
    context = canvas.getContext("2d");
    handleResize();
  };

  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (canvasWidth) {
      canvas.width = canvasWidth;
    }

    if (canvasHeight) {
      canvas.height = canvasHeight;
    }

    container.style.width = canvas.width + "px";
    container.style.height = canvas.height + "px";

    drawNoise();
  };

  const animate = () => {
    setTimeout(() => {
      drawNoise();
      requestAnimationFrame(animate);
    }, 1000 / fps);
  };

  const drawNoise = () => {
    const imageData = context.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const color = getRandomInt(0, 256);
      // Set pixel data
      data[i] = color; // Red channel
      data[i + 1] = color; // Green channel
      data[i + 2] = color; // Blue channel
      data[i + 3] = getRandomInt(0, 256); // Alpha channel (fully opaque)
    }

    // Put the pixel data on the canvas
    context.putImageData(imageData, 0, 0);
  };

  onMount(() => {
    initCanvas();
    animate();
  });

  $: fps = 40; // Example reactive variable
</script>

<svelte:window on:resize={handleResize}></svelte:window>

<div bind:this={container} class="noise-container" placement={placement}>
  <canvas bind:this={canvas}></canvas>
</div>

<style scoped>
  .noise-container {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgb(0, 0, 0);
    z-index: -1;
    opacity: .2;
  }

  .noise-container[placement="header"] {
    background-color: #d8d8d8;
    opacity: 1;
  }

  .noise-container[placement="header"] canvas {
    opacity: .1;
  }

  .noise-container[placement="background"] {
    top: var(--navbarHeight);
  }

  .noise-container[placement="background"] canvas {
    opacity: .6;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
</style>