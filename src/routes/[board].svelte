<script>
  import {onMount} from "svelte";
  import {getJob, getJobs} from "../services.js";
  import { fly } from 'svelte/transition';

  let board, jobs
  onMount(async () => {
    board = location.pathname.replace('/', '')
    jobs = await getJobs(board)
    // load additional data for a more robust search
    await jobs.map(async j => {
      const job = await getJob(board, j.id)
      Object.assign(j, job)
    })
  })

  let query = ''
  let filteredJobs
  $: if (query.length >= 2) {
    filteredJobs = jobs.filter(j => j.title?.includes(query) || j.content?.includes(query) || j?.location?.name?.includes(query))
  } else {
    filteredJobs = jobs
  }
</script>

<a href="..">Home</a>

<h1>{board}</h1>

{#if !jobs}
  <div out:fly={{duration: 1, y: -30}}>Loading...</div>
{:else}
  <article in:fly={{delay: 1, y: 30}}>
    <input type="text" bind:value="{query}" placeholder="Search">
    <button on:click={()=>query=''}>x</button>

    {#if jobs.length === 0}
      <div>No jobs found</div>
    {/if}

    <h2>
      Jobs
      {#if query.length < 2}
        ({jobs.length})
      {:else}
        ({filteredJobs.length}/{jobs.length})
      {/if}
    </h2>

    {#each filteredJobs as job}
      <div class="jobs">
        <a href="{job.absolute_url}" target="_blank">
          {job.title}
        </a>
        <span>{job.location.name}</span>
        <span>{new Date(job.updated_at).toLocaleString()}</span>
      </div>
    {/each}
  </article>
{/if}
<style>
    .jobs {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
    }

    .jobs:hover {
        background: #ffc1b9;
    }
</style>
