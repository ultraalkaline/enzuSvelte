<script>
  import { state } from '$lib/stores';
  import { onMount, onDestroy, getContext } from 'svelte';

  import Spotlight from 'spotlight.js';
  import { importProjectMedia, elementIsInViewport } from '$lib/HelperFunctions';
  import emitter from '$lib/eventBus';

  export let project;

  let projectContainerRef;
  let thresholdLineRef;
  let thresholdIndicatorRef;
  let projectMedia = importProjectMedia(project);
  let videos = [];
  let isVideoInViewport = false;
  let gallery;

  const cellSize = parseFloat(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--gridCellSize')
      .replace('px', '')
      .replace(' ', '')
  );

  const onCloseClick = () => {
    // Assuming there is a global event emitter in SvelteKit. If not, you can use a store or another mechanism.
    emitter.emit('toggle-grid');
    projectContainerRef.classList.add('hidden');
    $state = "projects";
  };

  onMount(() => {
    videos = Array.from(projectContainerRef.querySelectorAll('video'));

    // Create an Intersection Observer to track the video visibility
    const observer = new IntersectionObserver((entries, o) => {
      const thresholdLineRefTop = parseFloat(
        getComputedStyle(thresholdLineRef)
          .getPropertyValue('top')
          .replace('px', '')
          .replace(' ', '')
      );

      const navbarHeight = cellSize * 2;

      thresholdLineRef.style.height = projectContainerRef.clientHeight - thresholdLineRefTop + navbarHeight + cellSize + "px";
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.play();
          thresholdLineRef.classList.add('intersecting');
          thresholdIndicatorRef.classList.add('intersecting');
        } else {
          entry.target.pause();
          thresholdLineRef.classList.remove('intersecting');
          thresholdIndicatorRef.classList.remove('intersecting');
        }
      });
    }, { threshold: 0.6 });

    // Observe each video element
    videos.forEach((videoRef) => {
      observer.observe(videoRef);

      if (!videoRef.classList.contains('project-anim')) {
        //const videoName = videoRef.src.split('src');
        //let thresholdPlayEl = document.querySelector('.threshold-play#' + project.id + '_' + parseFloat(videoName[1].match(/\d+(\.\d+)?/)[0]));
      }
    });
  });

  onDestroy(() => {
    // Clean up the video player references
    videos = [];
  });
</script>

<style>
  @import '../css/ProjectContent.css';
</style>

<svelte:head>
</svelte:head>

<div bind:this={projectContainerRef} id="{`${project.id}-container`}" class="project-content hidden">
  <span bind:this={thresholdLineRef} class="threshold threshold-line"></span>
  <span bind:this={thresholdIndicatorRef} class="threshold threshold-indicator"></span>

  <div key="{`project-title_${project.id}`}" class="project-header-container">
    <div class="project-title-container">
      <div key="{project.id}" class="project-title">
        {#each project.projectName.split('') as char}
          {#if char === ' '}
            <span class="mobile-break">&nbsp;</span>
          {:else}
            <span>{char}</span>
          {/if}
        {/each}
      </div>
    </div>
    <div key="{`project-type_${project.id}`}" class="project-type">{project.type}</div>
  </div>

  <div class="project-anim-container">
    <video key="{`project-anim_${project.id}`}" id="{`${project.id}-anim`}" class="project-anim" alt="{`${project.id} animation`}" autoplay loop muted>
      <source src="{`${project.preview_mp4}`}" type='video/mp4; codecs=hvc1'>
      <source src="{`${project.preview_webm}`}" type='video/webm'>
    </video>
  </div>

  <div class="project-info-container">
    <div class="project-overview column">
      <div class="header">PROJECT OVERVIEW</div>
      <div key="{`project-overview_${project.id}`}" class="project-overview">{project.overview}</div>
    </div>

    <div class="project-tools column">
      <div class="header">TOOLS</div>
      {#each project.tools as tool (tool)}
        <div key="{`${project.id}_${tool}`}" class="project-tools row">{tool}</div>
      {/each}
    </div>

    <div class="project-creative-fields column">
      <div class="header">CREATIVE FIELDS</div>
      {#each project.creativeFields as creativeField (creativeField)}
        <div key="{`${project.id}_${creativeField}`}" class="project-creative row">{creativeField}</div>
      {/each}
    </div>

    <div class="project-tags column">
      <div class="header">TAGS</div>
      {#each project.tags as tag (tag)}
        <div key="{`${project.id}_${tag}`}" class="project-tags row">{tag}</div>
      {/each}
    </div>
  </div>

  <div class="project-media-container spotlight-group" id="{`project-media-container_${project.id}`}">
    {#each projectMedia as filePath (filePath)}
      
      {#if filePath.default.includes('.jpg') || filePath.default.includes('.jpeg') || filePath.default.includes('.png')}
        <a class="spotlight" href="{filePath.default}">
          <img src="{filePath.default}" alt="{filePath.default}" />
        </a>
      {/if}
      {#if filePath.default.includes('.webm') || filePath.default.includes('.mp4')}
        <video muted="muted" loop="loop">
          {#if filePath.default.includes('.webm')}
            <source src="{filePath.default}" type="video/webm">
          {:else if filePath.default.includes('.mp4')}
            <source src="{filePath.default}" type="video/mp4">
          {/if}
        </video>
        <span class="threshold-play" id="{project.id + `_` + parseFloat(filePath.default.match(/\d+(\.\d+)?/)[0])}"></span>
      {/if}
    {/each}
  </div>

  <button id="btn-close" key="{`btn-close_${project.id}`}" on:click={onCloseClick}>
    <div id="forwards" class="line"></div>
    <div id="backwards" class="line"></div>
  </button>
</div>