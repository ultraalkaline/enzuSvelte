<script>
  import { state } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import Spotlight from 'spotlight.js';
  import { importProjectMedia, removeClass } from '$lib/HelperFunctions';

  export let project;

  let projectContainerRef;

  let projectMedia = importProjectMedia(project);
  let videos = [];
  let gallery;
  let fadeObserver;
  let videoObserver;

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
    videos = Array.from(projectContainerRef.querySelectorAll('video'));

    fadeObserver = new IntersectionObserver((entries, o) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    videoObserver = new IntersectionObserver((entries, o) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          try {
            entry.target.play();
          } catch (err) {
            console.log("video ", entry.target.srcerr);
          }
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.6 });

    hiddenElements.forEach((el) => fadeObserver.observe(el));
    videos.forEach((vid) => videoObserver.observe(vid));
  });

  onDestroy(() => {
    // Clean up the video player references
    videos = [];
    fadeObserver.disconnect();
    videoObserver.disconnect();
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
          <img key={num} src="{filePath.default}" alt="{project.projectName}_{num}" />
        </a>
      {:else if filePath.default.includes('.webm')}
        <a class="spotlight hidden" href={filePath.default} data-src-webm={filePath.default} data-media="video" data-muted="true" data-title="{project.projectName}_{num}">
          <video key={num} muted="muted" loop="loop" src={filePath.default} type="video/webm"></video>
        </a>
      {:else if filePath.default.includes('.mp4')}
        <a class="spotlight hidden" href={filePath.default} data-src-mp4={filePath.default} data-media="video" data-muted="true" data-title="{project.projectName}_{num}">
          <video key={num} muted="muted" loop="loop" src={filePath.default} type="video/mp4" title="{project.id}_{num}"></video>
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