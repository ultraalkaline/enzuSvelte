<script>
  import { state } from '$lib/stores';
  import { onMount, onDestroy, getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import Spotlight from 'spotlight.js';
  import { importProjectMedia, elementIsInViewport, removeClass } from '$lib/HelperFunctions';

  export let project;

  let projectContainerRef;

  let projectMedia = importProjectMedia(project);
  let videos = [];
  let gallery;
  let observer;

  const cellSize = parseFloat(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--gridCellSize')
      .replace('px', '')
      .replace(' ', '')
  );

  const onCloseClick = () => {
    projectContainerRef.classList.add('hidden');
    removeClass('.project-content .show', 'show');
    $state = "projects";
  };

  const showGallery = () => {
    gallery.value.view(1);
  };

  onMount(() => {
    let hiddenElements = document.querySelectorAll('.project-content .hidden');
    observer = new IntersectionObserver((entries, o) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    hiddenElements.forEach((el) => observer.observe(el));
  });

  onDestroy(() => {
    // Clean up the video player references
    videos = [];
    observer.disconnect();
  });
</script>

<div bind:this={projectContainerRef} id="{`${project.id}-container`}" class="project-content hidden" transition:fade={{ duration: 200 }}>

  <div key="{`project-title_${project.id}`}" class="project-header-container">
    <div class="project-title-container">
      <div key="{project.id}" class="project-title">
        {#each project.projectName.split('') as char}
          {#if char === ' '}
            <span class="mobile-break hidden">&nbsp;</span>
          {:else}
            <span class="hidden">{char}</span>
          {/if}
        {/each}
      </div>
    </div>
    <div key="{`project-type_${project.id}`}" class="project-type hidden">{project.type}</div>
  </div>

  <div class="project-anim-container">
    <video key="{`project-anim_${project.id}`}" id="{`${project.id}-anim`}" class="project-anim hidden" alt="{`${project.id} animation`}" autoplay loop muted>
      <source src="{`${project.preview_mp4}`}" type='video/mp4; codecs=hvc1'>
      <source src="{`${project.preview_webm}`}" type='video/webm'>
    </video>
  </div>

  <div class="project-info-container">
    <div class="project-overview column">
      <div class="header hidden">PROJECT OVERVIEW</div>
      <div key="{`project-overview_${project.id}`}" class="project-overview hidden">{project.overview}</div>
    </div>

    <div class="project-tools column hidden">
      <div class="header">TOOLS</div>
      {#each project.tools as tool (tool)}
        <div key="{`${project.id}_${tool}`}" class="project-tools row">{tool}</div>
      {/each}
    </div>

    <div class="project-creative-fields column hidden">
      <div class="header">CREATIVE FIELDS</div>
      {#each project.creativeFields as creativeField (creativeField)}
        <div key="{`${project.id}_${creativeField}`}" class="project-creative row">{creativeField}</div>
      {/each}
    </div>

    <div class="project-tags column hidden">
      <div class="header">TAGS</div>
      {#each project.tags as tag (tag)}
        <div key="{`${project.id}_${tag}`}" class="project-tags row">{tag}</div>
      {/each}
    </div>
  </div>

  <div class="project-media-container spotlight-group" id="{`project-media-container_${project.id}`}">
    {#each projectMedia as filePath, num (filePath)}
      {#if filePath.default.includes('.webp')}
        <a class="spotlight hidden" href="{filePath.default}">
          <img key={num} src="{filePath.default}" alt="{filePath.default}" />
        </a>
      {:else if filePath.default.includes('.webm')}
        <a class="spotlight hidden" href={filePath.default} data-src-webm={filePath.default} data-media="video" data-muted="true">
          <video key={num} muted="muted" loop="loop" src={filePath.default}></video>
        </a>
      {:else if filePath.default.includes('.mp4')}
        <a class="spotlight hidden" href={filePath.default} data-src-mp4={filePath.default} data-media="video" data-muted="true">
          <video key={num} muted="muted" loop="loop" src={filePath.default}></video>
        </a>
      {/if}
    {/each}
  </div>

  <button class="hidden" id="btn-close" key="{`btn-close_${project.id}`}" on:click={onCloseClick}>
    <div id="forwards" class="line"></div>
    <div id="backwards" class="line"></div>
  </button>
</div>

<style>
  @import '../css/ProjectContent.css';
</style>