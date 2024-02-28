<script>
  import { state } from '$lib/stores';
  import { onMount, onDestroy, getContext } from 'svelte';

  import Spotlight from 'spotlight.js/src/js/spotlight';
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
            {console.log(filePath.default)}
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

<style scoped>
  * {
    --projectItemWidth: calc(var(--gridCellSize) * 10);
    --projectItemMargin: calc(var(--projectItemWidth) / 2);
    --btnCloseLeft: calc(var(--gridCellSize) * 2);

    --thresholdLineWidth: 2px;
    --thresholdIndicatorSize: 24px;
    --thresholdIndicatorBorderWidth: 2px;

    --thresholdLineRight: calc(var(--gridCellSize) * 2.5 - var(--thresholdLineWidth) / 2);
    --threhsoldIndicatorRight: calc(var(--gridCellSize) * 2.5 - var(--thresholdIndicatorSize) / 2 - var(--thresholdIndicatorBorderWidth) / 2);
    --thresholdLineTop: calc(var(--navbarHeight) + var(--gridCellSize) * 3);
    --thresholdIndicatorTop: calc(50% - (var(--navbarHeight) - var(--gridCellSize) * 3));
  }

  .threshold {
    transition: background 100ms ease;
  }

  .threshold-indicator {
    position: fixed;
    display: inline-block;

    width: var(--thresholdIndicatorSize);
    height: var(--thresholdIndicatorSize);
    right: calc(var(--threhsoldIndicatorRight) - var(--thresholdIndicatorBorderWidth) / 2);
    top: var(--thresholdIndicatorTop);

    border: var(--thresholdIndicatorBorderWidth) solid var(--colorIntersecting);
    background: none;
    border-radius: 100%;
  }

  .threshold-line {
    position: absolute;
    display: inline-block;
    flex: 1;  

    width: var(--thresholdLineWidth);
    height: 100%;
    right: var(--thresholdLineRight);
    top: var(--thresholdLineTop);
    border-radius: .5em;

    background: var(--colorThresholdLine);
  }

  .threshold-indicator.intersecting {
    background: var(--colorIntersecting);
  }

  .threshold-play {
    position: absolute;
    display: inline-block;

    width: 18px;
    height: 18px;
    right: var(--threhsoldIndicatorRight);

    border: 2px solid var(--colorThresholdLine);
    border-radius: 100%;

    background: none;
  }

  .project-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    min-height: min-content;

    margin-top: calc(var(--navbarHeight) + var(--gridCellSize) * 1);
    user-select: none;
    margin-bottom: var(--gridCellSize);

    z-index: 1;
  }

  .project-content.hidden {
    display: none;
  }

  .project-header-container {
    display: flex;
    display: webkit-box;
    display: webkit-flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
  }

  .project-title-container {
    display: inline-flex;
    flex-direction: row;
    justify-self: flex-start;
    gap: calc(var(--gridCellSize));
  }

  #btn-close {
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    width: var(--gridCellSize);
    height: var(--gridCellSize);
    padding: 0;
    left: var(--btnCloseLeft);

    backdrop-filter: blur(2px);

    transition: background 200ms ease-in-out, right 100ms ease-in-out, bottom 100ms ease-in-out, top 100ms ease-in-out, left 100ms ease-in-out;
  }

  #btn-close:hover {
    background: var(--colorDark);
  }

  #btn-close:hover .line {
    background: var(--colorLight);
  }

  #btn-close .line {
    width: 2px;
    height: calc(var(--gridCellSize) * .90);
    background-color: var(--colorTextBlue);

    transition: fill 200ms ease-in-out;
  }

  #btn-close #backwards {
    margin-left: -2px;
    transform: rotateZ(-45deg);
  }

  #btn-close #forwards {
    transform: rotateZ(45deg);
  }

  .project-title {
    display: flex;
    flex-wrap: wrap;
    font-family: ClashGrotesk-Regular;
    font-size: var(--projTitleFontSize);
    color: var(--colorTextPrimary);
    hyphens: auto;
    white-space: wrap;
    text-align: justify;
    text-justify: inter-word;
    margin-left: var(--projectItemMargin);
  }

  .project-title span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: var(--gridCellSize);
    height: var(--gridCellSize);
  }

  .project-type {
    font-family: ClashGrotesk-Regular;
    font-size: var(--projTypeFontSize);
    color: var(--colorTextSecondary);
    margin-right: var(--projectItemMargin);
  }

  .project-anim-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: calc(100% - var(--projectItemWidth));

    object-fit: contain;
    
    margin-top: var(--gridCellSize);
    border: var(--projectImgBorder);
  }

  .project-anim {
    width: 100%;
    height: 100%;

    object-fit: contain;
  }

  .project-info-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    gap: var(--projectInfoGap);
    width: calc(100% - var(--projectItemWidth));
    margin-top: calc(var(--gridCellSize) * 2);
  }

  .project-info-container > .column {
    display: flex;
    flex-direction: column;
    
    font-family: ClashGrotesk-Regular;
    font-size: calc(var(--gridCellSize) * .7);
    color: var(--colorTextPrimary);
  }

  .project-info-container .header, .project-info-container .row {
    white-space: nowrap;
  }

  .project-info-container .row, .project-overview {
    font-family: ClashGrotesk-Light;
    font-size: calc(var(--gridCellSize) / 2);

    line-height: calc(var(--gridCellSize) * .75);
  }

  .project-info-container > .column > .row:nth-child(2), .project-overview:not(.column) {
    margin-top: var(--gridCellSize);
  }

  .project-overview {
    max-width: var(--projectItemWidth);
    hyphens: auto;
    white-space: wrap;
    text-align: justify;
    text-justify: inter-word;
  }

  .project-media-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    
    width: calc(100% - var(--projectItemWidth));
    height: fit-content;
    
    margin-top: calc(var(--gridCellSize) * 2);

    font-size: 0;
  }

  .project-media-container img, .project-media-container video {
    width: 100%;
    height: fit-content;
    object-fit: contain;
  }

  .project-media-container .spotlight {
    width: 100%;
    height: fit-content;
    object-fit: contain;
  }

  @media only screen and (max-width: 1600px) {
    .project-info-container {
      --projectInfoGap: calc(var(--gridCellSize) * 2);
    }

    .project-info-container .column:first-of-type {
      flex-basis: 100%;
    }

    .project-overview {
      max-width: none;
    }

    .project-info-container .column:not(:first-of-type) {
      flex-basis: calc(100% / 3 - var(--projectInfoGap));
    }
  }

  @media only screen and (max-width: 1582px) {
    .project-info-container {
      --projectInfoGap: calc(var(--gridCellSize) * 4);
    }
  }

  @media only screen and (max-width: 1200px) {
    * {
      --projectItemWidth: calc(var(--gridCellSize) * 6);
      --btnCloseLeft: calc(var(--gridCellSize) * 1);

      --thresholdIndicatorSize: 18px;

      --thresholdLineRight: calc(var(--gridCellSize) * 1.5 - var(--thresholdLineWidth) / 2);
      --threhsoldIndicatorRight: calc(var(--gridCellSize) * 1.5 - var(--thresholdIndicatorSize) / 2);
      --thresholdLineTop: calc(var(--navbarHeight) + var(--gridCellSize) * 3);
      --thresholdIndicatorTop: calc(var(--navbarHeight) + var(--gridCellSize) * 8);
    }
  }

  @media only screen and (max-width: 1133px) {
    * {
      --thresholdLineTop: calc(var(--navbarHeight) + var(--gridCellSize) * 3.5);
    }

    .project-info-container {
      --projectInfoGap: calc(var(--gridCellSize) * 2);
    }

    .project-info-container > .column {
      font-size: calc(var(--gridCellSize) * .6);
    }

    .project-info-container .row {
      font-size: calc(var(--gridCellSize) * .7);
    }

    .project-info-container .row, .project-overview {
      font-size: calc(var(--gridCellSize) * .5);
    }

    .project-header-container .project-type {
      flex-basis: 100%;
      padding: 0 var(--projectItemMargin);
      transform: translate(
        calc(var(--gridCellSize) / 2 - var(--projTypeFontSize) / 4 - 1px), 
        calc(var(--gridCellSize) / 2 - var(--projTypeFontSize) / 2));
    }
  }

  @media only screen and (max-width: 950px) {
    .project-info-container > .column {
      font-size: calc(var(--gridCellSize) * .5);
    }

    .project-info-container .row {
      font-size: calc(var(--gridCellSize) * .6);
    }

    .project-info-container .row, .project-overview {
      font-size: calc(var(--gridCellSize) * .4);
    }

    .project-header-container .project-title span + .mobile-break {
      flex-basis: 100%;
      height: 0;
    }
  }

  @media only screen and (max-width: 750px) {

    .threshold-indicator, .threshold-line {
      display: none;
    }

    .project-header-container {
      justify-content: flex-start;
    }

    .project-header-container > div {
      flex-basis: 100%;
      padding: 0 var(--gridCellSize);
    }

    .project-header-container .project-title {
      margin-left: 0;
    }

    .project-header-container .project-type {
      margin-right: 0;
      padding: 0 calc(var(--gridCellSize) * 1);
      transform: translate(
          calc(var(--gridCellSize) / 2 - var(--projTypeFontSize) / 4 - 1px), 
          calc(var(--gridCellSize) / 2 - var(--projTypeFontSize) / 2));
    }

    .project-anim-container {
      width: calc(100% - (var(--gridCellSize) * 2));
    }

    .project-info-container {
      --projectInfoGap: calc(var(--gridCellSize) * 1);
      width: calc(100% - (var(--gridCellSize) * 2));
    }

    .project-info-container > .column {
      font-size: calc(var(--gridCellSize) * .4);
    }

    .project-info-container > .column > .row:nth-child(2), .project-overview:not(.column) {
      margin-top: calc(var(--gridCellSize) * .5);
    }

    .project-info-container .row {
      font-size: calc(var(--gridCellSize) * .6);
      margin-bottom: -4px;
    }

    .project-info-container .row, .project-overview {
      font-size: calc(var(--gridCellSize) * .4);
    }

    #btn-close {
      left: inherit;
      right: var(--gridCellSize);
      bottom: var(--gridCellSize);
    }

    .project-media-container {
      width: calc(100% - (var(--gridCellSize) * 2));
    }
  }
</style>