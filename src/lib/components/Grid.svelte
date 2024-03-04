

<script>
  import { state } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  import { slide } from 'svelte/transition';
  import jQ from 'jquery';
  import { getRandomInt, getRandomChar, addClass, removeClass, hasClass, elHasClass, shuffleRandomChars } from '$lib/HelperFunctions';
  import { Projects } from '$lib/Projects';
  import anime from 'animejs';

  // Constants
  const cellSize = parseFloat(
    getComputedStyle(document.documentElement)
          .getPropertyValue('--gridCellSize')
          .replace('px', '')
          .replace(' ', '')
  );
  const navbarHeight = cellSize * 2;

  // Vars
  let grid;
  let projectType;
  let contactEmail = "BARSIN.NISSAN@GMAIL.COM";
  let contactInsta = "ENZU.DESIGN";
  let activeCellHoverTimelines = [];

  // Refs
  let projectTypePreviewRef, projectThumbPreviewRef, contactEmailRef, contactInstaRef;

  function generateGrid() {
    // Get the dimensions of the grid based on window width and height
    let numRows = Math.floor((window.innerHeight - navbarHeight) / cellSize);
        let numCols = Math.floor(window.innerWidth / cellSize);
        
        // Always make sure that the number of rows is at least as many as the number of projects, with a gap in-between each project
        if (numRows < Projects.length + (Projects.length * 2))
          numRows = Projects.length + (Projects.length * 2);

        // Create an empty grid array
        let grid = [];

        // Populate the grid with characters
        for (let R = 0; R < numRows; R++) {
          let row = { row: R, shownProject: "", cells: [] };

          for (let C = 0; C < numCols; C++) {
            let char = getRandomChar(false);
            row.cells.push({char: char, class: 'cell', row: R, col: C});
          }
          grid.push(row);
        }
      
        return {grid: grid, rows: numRows, cols: numCols};
  }

  const onStateUpdated = () => {
    switch ($state)
    {
      case "projects":
        if (!jQ("#mobile-menu").is(":visible"))
          jQ("#work-content").show(200);
        else
          jQ("#work-content").hide(200);
        clearGrid();
        populateGridWithProjects();
        break;
      case "about":
        jQ("#work-content").hide(200);
        break;
      case "contact":
        if (!jQ("#mobile-menu").is(":visible"))
          jQ("#work-content").show(200);
        else
          jQ("#work-content").hide(200);
        clearGrid();
        displayContactInfo();
        break;
    }
  }

  function initializeGrid() {
    grid = generateGrid();
    onStateUpdated();
  }

  initializeGrid();

  function onCellHover(cell) {
    const cellClass = cell.class;

    // Handle random character cell hover
    if (!cellClass.includes("project") && !cellClass.includes("contact")) {
      removeClass(".cell.hovered", "hovered");
      removeClass(".cell.hidden", "hidden");
      projectTypePreviewRef.classList.add('hidden');
      projectThumbPreviewRef.classList.add('hidden');
      contactEmailRef.classList.add('hidden');
      contactInstaRef.classList.add('hidden');

      shuffleCellAnim(cell, getRandomChar());
    }
    // Handle project name cell hover
    else if (cellClass.includes("project")) {
      let projectName = cellClass.replace(" project cell", "");
      if (!hasClass("." + projectName, "hovered")) {
        removeClass(".cell.hidden", "hidden");
        projectTypePreviewRef.classList.add('hidden');
        projectThumbPreviewRef.classList.add('hidden');
        removeClass(".cell:not(." + projectName + ")", "hovered");
        addClass("." + projectName, "hovered");
        addClass(".cell:not(." + projectName + ")", "hidden");

        const projectCells = document.getElementsByClassName(projectName);
        const firstCharColumn = parseInt(projectCells[0].getAttribute("col"));
        const rowUnderProject = parseInt(projectCells[projectCells.length - 1].getAttribute("row")) + 1;
        const rowOverProject = parseInt(projectCells[0].getAttribute("row")) - 1;

        // Add project type directly under or over the project name
        // Check if row under project name exists (in case the project name is on the last row)
        let projTypeCell = null;
        if (grid.grid.length > rowUnderProject)
        {
          projTypeCell = document.querySelector("[row='" + rowUnderProject + "'][col='" + firstCharColumn + "']");
        }
        // If not, show project type on the row above
        else
        {
          projTypeCell = document.querySelector("[row='" + rowOverProject + "'][col='" + firstCharColumn + "']");
        }
        
        // Get the project
        const project = Projects.find((project) => project.id === cellClass.replace(" project cell", ""));
        if (project) {
          projectType = project.type; // Update the projectType ref with the project type
          
          if (window.innerWidth > 800) {
            if (project.preview_mp4 && project.preview_webm) {
              projectThumbPreviewRef.setAttribute('key', 'project-thumb_' + project.id);
              projectThumbPreviewRef.firstChild.src = project.preview_mp4;
              projectThumbPreviewRef.lastChild.src = project.preview_webm;
              projectThumbPreviewRef.load();
              removeClass('#project-thumb_preview', 'hidden');
            } else {
              projectThumbPreviewRef.firstChild.src = null;
              projectThumbPreviewRef.lastChild.src = null;
            }
          }
        }

        const cellPos = projTypeCell.getBoundingClientRect();

        projectTypePreviewRef.style.top = cellPos.top + window.scrollY - navbarHeight + "px";
        projectTypePreviewRef.style.left = cellPos.left + window.scrollX + "px";
        
        shuffleRandomChars(projectTypePreviewRef, projectType, false);

        removeClass("#project-type_preview", "hidden");
      }
    }
    else if (cellClass.includes("contact")) {
      if (!hasClass(".contact.cell", "hovered")) {
        if (cellClass.includes("email")) {
          addClass(".cell:not(.email)", "hidden");
          addClass(".contact.cell.email", "hovered");
          removeClass(".contact-tooltip:not(#contact-email)", "hovered");

          const emailEl = document.getElementById('contact-email');
          const contactCells = document.querySelectorAll('.cell.contact.email');
          const firstCharColumn = parseInt(contactCells[0].getAttribute("col"));
          const rowUnderCells = parseInt(contactCells[0].getAttribute("row")) + 1;

          const emailCell = document.querySelector("[row='" + rowUnderCells + "'][col='" + firstCharColumn + "']");
          const emailCellRect = emailCell.getBoundingClientRect();
          emailEl.style.top = emailCellRect.top + window.scrollY - navbarHeight + "px";
          emailEl.style.left = emailCellRect.left + window.scrollX + "px";

          removeClass("#contact-email", "hidden");
          shuffleRandomChars(emailEl, contactEmail, false);
        }
        else if (cellClass.includes("insta")) {
          addClass(".cell:not(.insta)", "hidden");
          addClass(".contact.cell.insta", "hovered");
          removeClass(".contact-tooltip:not(#contact-insta)", "hovered");

          const instaEl = document.getElementById('contact-instagram');
          const contactCells = document.querySelectorAll('.cell.contact.insta');
          const firstCharColumn = parseInt(contactCells[0].getAttribute("col"));
          const rowUnderCells = parseInt(contactCells[0].getAttribute("row")) + 1;

          const instaCell = document.querySelector("[row='" + rowUnderCells + "'][col='" + firstCharColumn + "']");
          const instaCellRect = instaCell.getBoundingClientRect();
          instaEl.style.top = instaCellRect.top + window.scrollY - navbarHeight + "px";
          instaEl.style.left = instaCellRect.left + window.scrollX + "px";

          removeClass("#contact-instagram", "hidden");
          shuffleRandomChars(instaEl, contactInsta, false);
        }
      }
    }
  }

  function onCellClick(cell) {
    const cellClass = cell.class;
    
    // Only handle project name cell clicks
    if (cellClass.includes("project")) {
      let projectName = cellClass.replace(" project cell", "");
      removeClass("#" + projectName + "-container", "hidden");
      // Reset navigation buttons when a project is opened
      $state = "project";
      window.scrollTo(0, 0);
    } else if (cellClass.includes("contact")) {
      if (cellClass.includes("email")) {
        window.open('mailto:' + contactEmail.toLowerCase(), '_self');
      } else {
        window.open('https://www.instagram.com/' + contactInsta.toLowerCase(), '_blank');
      }
    }
  }

  const onGridUnHover = () => {
    addClass("#project-type_preview", "hidden");
    addClass("#project-thumb_preview", "hidden");
    addClass("#contact-email", "hidden");
    addClass("#contact-instagram", "hidden");
    removeClass(".cell", "hovered");
    removeClass(".cell.hidden", "hidden");

    projectType = null;
  }

  function shuffleCellAnim(originalCell, newChar, projectId) {
    const disappearDelay = 200; // Delay for the letters to disappear in milliseconds
    const numIterations = 5; // Number of iterations to alter between random letters
    const duration = 100; // Duration of each iteration in milliseconds
    const delay = 50; // Delay between iterations in milliseconds

    const cellEl = document.querySelector(`[row='${originalCell.row}'][col='${originalCell.col}']`);

    if (cellEl)
    {
      grid.grid[originalCell.row].cells[originalCell.col].char = "";

      // Create the anime.js timeline for the animation
      const timeline = anime.timeline({
        autoplay: false, // Set to true if you want the animation to start immediately
        complete: () => {
          // Set the grid value for the cell at the end of all animations
          grid.grid[originalCell.row].cells[originalCell.col].char = newChar;
        },
      });

      for (let i = 0; i < numIterations; i++) {
        // Animation to alter between random letters
        timeline.add({
          targets: cellEl,
          duration: duration + delay,
          easing: "linear",
          complete: () => {
            // Set the text content to a random character during the animation
            const randomChar = getRandomChar();
            cellEl.textContent = randomChar;
          },
        });
      }
      
      // Animation to settle on a fixed random letter
      timeline.add({
        targets: cellEl,
        duration,
        delay: numIterations * (duration + delay),
        easing: "linear",
        update: () => {
          // Set the text content to the final letter during the animation
          cellEl.textContent = newChar;
        },
      });

      // Start the anime.js timeline with the initial delay
      setTimeout(() => {
        activeCellHoverTimelines.push(timeline);
        timeline.play();
      }, disappearDelay);
    }
  }

  function populateGridWithProjects() {
    // Copy of projects array to keep track of shown projects in the grid
    let availableProjects = [...Projects];
    grid.grid.filter(row => row.shownProject === "").forEach(row => {
      // Start from the second row
      // Put two empty rows between each project
      if (row.row > 0 && (row.row - 1) % 3 === 0)
      {
        let projectIndex = Math.floor(Math.random() * availableProjects.length);
        let project = availableProjects.splice(projectIndex, 1)[0];

        if (project !== undefined)
        {
          let colBuffer = 0;
          if (grid.cols >= 40) {
            // Buffer between 20% to 60% of total columns
            colBuffer = getRandomInt(grid.cols - Math.floor(grid.cols * .8), grid.cols - Math.floor(grid.cols * .4));
          } else if (grid.cols < 40 && grid.cols > 20) {
            colBuffer = getRandomInt(grid.cols - Math.floor(grid.cols * .9), grid.cols - Math.floor(grid.cols * .4));
          } else if (grid.cols < 30 && grid.cols > 20) {
            colBuffer = getRandomInt(grid.cols - Math.floor(grid.cols * .9), grid.cols - Math.floor(grid.cols * .4));
          } else {
            colBuffer = getRandomInt(grid.cols - Math.floor(grid.cols * .9), grid.cols - Math.floor(grid.cols * .8));
          }

          let projectName = project.projectName.split(" ");

          if (projectName.length > 1) {
            // Check if grid columns (incl. colBuffer) can contain the entire project name
            if (grid.cols >= grid.cols - (grid.cols - colBuffer) + (projectName[0].length + projectName[1].length + 1))
            {
              insertProjectName(project.id, projectName, row, colBuffer);
            }
            // If not, split project name into two parts at whitespace
            else
            {
              insertProjectName(project.id, [projectName[0]], row, colBuffer);
              insertProjectName(project.id, [projectName[1]], grid.grid[row.row + 1], colBuffer);
            }
          } else {
            insertProjectName(project.id, projectName, row, colBuffer);
          }
        }          
      }
    });
  }

  function insertProjectName(projectId, projectName, row, colBuffer) {
    if (projectId !== undefined)
    {
      let projectChars = projectName.join(" ").split("");
      // Always contain the project name within the row
      if (grid.cols - colBuffer < projectChars.length)
      {
        colBuffer = colBuffer - (projectChars.length - (grid.cols - colBuffer));
      }
      // Insert the project characters in the row in a sequence after the start buffer
      for (let C = colBuffer; C < grid.cols; C++) {
        if (projectChars.length > 0) {
          let projChar = projectChars.shift();
          const newCell = {char: projChar, class: projectId + ' project cell', row: row.row, col: C};
          row.cells[C].char = projChar;
          //shuffleCellAnim(row.cells[C], projChar);
          row.cells[C].class = projectId + ' project cell';
          row.cells[C].row = row.row;
          row.cells[C].col = C;
        }
      }
      // Mark the row as showing this project
      row.shownProject = projectName;
      // Update the row in the grid
      grid.grid[row.row] = row;
    }
  }

  function clearGrid() {
    // Stop all anime.js cell hover animations
    for (let i = 0; i < activeCellHoverTimelines.length; i++) {
      activeCellHoverTimelines[i].pause();
    }

    // Remove all project characters from grid
    grid.grid.filter(row => row.shownProject !== "").forEach(row => {
      row.cells.forEach(cell => {
        if (cell.class.includes("project")) {
          cell.char = getRandomChar();
          //shuffleCellAnim(cell, getRandomChar());
          cell.class = 'cell';
        }
      });
      row.shownProject = "";
      grid.grid[row.row] = row;
    });

    // Remove contact info from grid
    grid.grid.filter(row => row.hasContactInfo).forEach(row => {
      row.cells.forEach(cell => {
        if (cell.class.includes("contact")) {
          cell.char = getRandomChar();
          cell.class = 'cell';
        }
      });
      row.hasContactInfo = false;
      grid.grid[row.row] = row;
    });
  }

  function displayContactInfo() {
    let colBuffer = 0;
    let rowBuffer = 1;

    if (grid.cols >= 10) {
      colBuffer = getRandomInt(grid.cols - Math.floor(grid.cols * .9), grid.cols - Math.floor(grid.cols * .8));
    } else {
      colBuffer = getRandomInt(grid.cols - Math.floor(grid.cols * .2), grid.cols - Math.floor(grid.cols * .1));
    }

    if (contactEmail && contactInsta) {
      const emptyRow = grid.grid.find(row => row.shownProject === "" && !row.hasContactInfo && row.row == rowBuffer);
      const nextEmptyRow = grid.grid[emptyRow.row + 2];
      
      if (emptyRow) {
        // Insert the title first (after the buffer)
        let stringChars = "EMAIL".split("");
        for (let C = colBuffer; C < grid.cols; C++) {
          if (stringChars.length > 0) {
            let stringChar = stringChars.shift();
            if (stringChar !== " ") {
              emptyRow.cells[C].char = stringChar;
              emptyRow.cells[C].class = 'contact email cell';
            }
          }
        }
        emptyRow.hasContactInfo = true;
        grid.grid[emptyRow.row] = emptyRow;
      }

      if (nextEmptyRow) {
        // Insert the title first (after the buffer)
        let stringChars = "INSTA".split("");
        for (let C = colBuffer; C < grid.cols; C++) {
          if (stringChars.length > 0) {
            let stringChar = stringChars.shift();
            if (stringChar !== " ") {
              nextEmptyRow.cells[C].char = stringChar;
              nextEmptyRow.cells[C].class = 'contact insta cell';
            }
          }
        }
        nextEmptyRow.hasContactInfo = true;
        grid.grid[nextEmptyRow.row] = nextEmptyRow;
      }
    }
  }

  function updateThumbPreviewPos(event) {
    // TODO: Transform this function to return `top` and `left` for `projThumbEl` and use it in the style directly.
    // See https://svelte.dev/docs/element-directives#style-property for reference
    let projThumbEl = document.getElementById("project-thumb_preview");
    if (projThumbEl && !elHasClass(projThumbEl, 'hidden')) 
    {
      const cursorX = event.clientX;
      const cursorY = event.clientY;
      const previewWidth = projThumbEl.offsetWidth;
      const previewHeight = projThumbEl.offsetHeight;
      const buffer = 20;
      const availableRightSpace = viewportWidth - cursorX - buffer;
      const availableLeftSpace = cursorX - buffer;
      const availableTopSpace = cursorY - buffer;
      const availableBottomSpace = viewportHeight - cursorY - buffer;

      let left, top;

      // If right space can contain the preview
      if (availableRightSpace >= previewWidth) {
        left = cursorX + buffer;
      } 
      // otherwise, if left space can contain the preview
      else if (availableLeftSpace >= previewWidth) {
        left = cursorX - previewWidth - buffer;
      } 
      // if all else fails, place to the right of cursor
      else {
        left = cursorX + buffer; // Fallback to right if no horizontal space
      }

      // If bottom space can contain the preview
      if (availableBottomSpace >= previewHeight) {
        top = cursorY + buffer;
      } 
      // otherwise, if top space can contain the preview
      else if (availableTopSpace >= previewHeight) {
        top = cursorY - previewHeight - buffer;
      } else {
        top = cursorY + buffer; // Fallback to bottom if no vertical space
      }

      projThumbEl.style.left = `${left}px`;
      projThumbEl.style.top = `${top}px`;
    }
  };

  onMount(() => {
    initializeGrid();

    // Only re-init the grid on width changes.
    let prevWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth !== prevWidth) {
        clearGrid();
        initializeGrid();
        switch ($state) {
          case "projects":
            populateGridWithProjects();
            break;
          case "contact":
            displayContactInfo();
            break;
        }
        prevWidth = window.innerWidth;
      }
    });
  });

  onDestroy(() => {
    removeClass('.cell.hidden', 'hidden');
    removeClass('.cell.hovered', 'hovered');

    window.removeEventListener('resize', initializeGrid);
  });

  // Executes whenever the value of `state` changes
  state.subscribe((value) => {
    onStateUpdated();
  });

  $: grid = generateGrid();
  $: viewportWidth = 0;
  $: viewportHeight = 0;
</script>

{#if $state === "projects" || $state === "contact"}
<div id="work-content" class="nav-content" transition:slide={{ duration: 200 }}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div id="grid" on:mouseleave={onGridUnHover} on:mousemove={updateThumbPreviewPos}>
    {#each grid.grid as row, R}
      <div class="row" role="row">
        {#each row.cells as cell, col (cell)}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div 
            class={cell.class}
            row={R}
            col={col}
            on:mouseenter={onCellHover(cell)}
            on:click={onCellClick(cell)}>
            { cell.char }
          </div>
        {/each}
      </div>        
    {/each}
    

  <div id="project-type_preview"
    class="hidden floating" 
    hidden={!projectType}
    bind:this={projectTypePreviewRef}>
    { projectType }
  </div>

  <a id="contact-email" class="hidden floating contact-tooltip"
    href={`mailto:${contactEmail}`}
    hidden={!contactEmail}
    bind:this={contactEmailRef}>
    { contactEmail }
  </a>

  <a id="contact-instagram" class="hidden floating contact-tooltip"
    href={`https://www.instagram.com/@${contactInsta}`}
    v-show="contactInsta"
    bind:this={contactInstaRef}>
    { contactInsta }
  </a>

  <video
    id="project-thumb_preview"
    alt="project preview"
    bind:this={projectThumbPreviewRef}
    class="hidden"
    autoplay
    playsinline
    loop
    muted>
    <source
      type='video/mp4; codecs=hvc1'/>
    <source
      type='video/webm'/>
  </video>
  </div>
</div>
{/if}

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight}></svelte:window>

<style>
  @import '../css/Grid.css';
</style>