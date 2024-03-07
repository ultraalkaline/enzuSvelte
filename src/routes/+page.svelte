<script>
  import { onMount } from 'svelte';
  import { Projects } from '$lib/Projects.js';
  import NoiseComponent from '$lib/components/Noise.svelte';
  import GridComponent from '$lib/components/Grid.svelte';
  import ProjectContent from '$lib/components/ProjectContent.svelte';
  import ENZULogo from '$lib/img/icons/Enzu_logo.svg';

  import { state, STATE } from '$lib/stores';
  import { shuffleLoaderChars, shuffleCharacters, addClass } from '$lib/HelperFunctions';

  import jQ from 'jquery';

  $state = STATE.Loading;

  let headerNoiseRef;
  let gridComponentRef;
  let hamburgerRef;
  let mobileMenuRef;

  document.fonts.ready.then(() => {
    jQ("#loader-text").fadeIn(500);
    shuffleLoaderChars("enzu", true).then(() => {
      setTimeout(() => {
        jQ("#loader").fadeOut(200, () => {
          jQ("#app").fadeIn(200);
        });
      }, 1500);
    });
  });

  const SetPageState = (newState) => {
    if (newState !== STATE.Project)
      addClass('.project-content', 'hidden');
    $state = newState;
  }

  const ToggleHamburger = () => {
    if (!mobileMenuRef.classList.contains('active')) {
      mobileMenuRef.classList.add('active');
      hamburgerRef.classList.add('active');
      if (jQ('#work-content').is(':visible'))
        jQ('#work-content').hide(200);
    } else {
      mobileMenuRef.classList.remove('active');
      hamburgerRef.classList.remove('active');
      if ($state == STATE.Projects)
        jQ('#work-content').show(200);
    }
  }

  const navBtnHover = (btn) => {
    shuffleCharacters(btn, btn.textContent);
  }

  onMount(() => {
    $state = STATE.Projects;
  });

  // Similar to Vue `watch`
  state.subscribe((value) => {
    jQ(".nav-btn:not([name='" + value + "']").removeClass("active");
    jQ(".nav-content:not([name='" + value + "']").removeClass("active");

    if (!jQ("button[name='" + value + "']").hasClass("active")) {
      jQ("button[name='" + value + "']").addClass("active");
    }

    // Only executes when #mobile-menu is visible
    if (mobileMenuRef) {
      if (mobileMenuRef.classList.contains('active'))
        ToggleHamburger();
    }
  });

  $: headerNoiseWidth = 0;
  $: headerNoiseHeight = parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--gridCellSize')
        .replace('px', '')
        .replace(' ', '')
    ) * 2;

  export { STATE };
</script>

<svelte:window bind:innerWidth={headerNoiseWidth}></svelte:window>

<style>
  @import '../lib/css/App.css';
  @import '../lib/css/NavMenu.css';
</style>

<section id="app">
  <div id="main">
    <NoiseComponent placement='background' />
    <div id="nav-container">
      <NoiseComponent bind:this={headerNoiseRef} placement='header' canvasHeight={headerNoiseHeight} />
      <div id="title">
        <div id="title-container">
          <img src={ENZULogo} alt="enzu" class="logo"/>
        </div>
      </div>
      
      <div id="nav-items">
        <button name="contact" class="nav-btn" on:click={(event) => SetPageState(event.target.name)} on:mouseenter={(event) => navBtnHover(event.target)}>CONTACT</button>
        <button name="about" class="nav-btn" on:click={(event) => SetPageState(event.target.name)} on:mouseenter={(event) => navBtnHover(event.target)}>ABOUT</button>
        <button name="projects" class="nav-btn active" on:click={(event) => SetPageState(event.target.name)} on:mouseenter={(event) => navBtnHover(event.target)}>PROJECTS</button>
      </div>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div id="hamburger" bind:this={hamburgerRef} on:click={ToggleHamburger} role="button" tabindex="0">
        <span id="top" class="line"></span>
        <span id="mid" class="line"></span>
        <span id="bot" class="line"></span>
      </div>

      <div id="mobile-menu" bind:this={mobileMenuRef}>
        <button name="contact" class="nav-btn" on:click={(event) => SetPageState(event.target.name)} on:mouseenter={(event) => navBtnHover(event.target)}>CONTACT</button>
        <button name="about" class="nav-btn" on:click={(event) => SetPageState(event.target.name)} on:mouseenter={(event) => navBtnHover(event.target)}>ABOUT</button>
        <button name="projects" class="nav-btn active" on:click={(event) => SetPageState(event.target.name)} on:mouseenter={(event) => navBtnHover(event.target)}>PROJECTS</button>
      </div>
    </div>

    <GridComponent bind:this={gridComponentRef} />

    {#each Projects as project (project.id)}
      <ProjectContent 
        project={project} />
    {/each}
  </div>
</section>
