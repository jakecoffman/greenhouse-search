<script>
  import {onMount} from "svelte";

  let board
  let jobs = Promise.resolve()
  onMount(() => {
    board = location.pathname.replace('/', '')
    jobs = getJobs()
  })

  async function getJobs() {
    const r = await fetch(`/boards/${board}/jobs`)
    if (!r.ok) {
      return alert(await r.text())
    }
    let jobs = await r.json()

    // add filtering so you don't download every opening
    if (board === 'github') {
      jobs = jobs.jobs.filter(j => !j.title.includes('Manager') && j.metadata.some(m => m.value === 'Engineering'))
    } else if (board === 'reddit') {
      jobs = jobs.jobs.filter(j => j.metadata.find(m => m.name === 'Job Family').value === 'Software Engineering')
      jobs = jobs.filter(j => j.location.name.includes('Remote'))
    } else if (board === 'datadog') {
      jobs = jobs.jobs.filter(j => j.metadata.find(m => m.name === 'Cost Center')?.value?.includes('Engineering'))
      jobs = jobs.filter(j => j.location.name.includes('Remote'))
      jobs = jobs.filter(j => !j.title.includes('Manager'))
    } else {
      jobs = jobs.jobs
    }
    if (jobs.length > 200) {
      // don't want to make too many calls
      return jobs
    }
    const full = await Promise.all(jobs.map(j => getJob(j.id)))
    return full.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  }

  async function getJob(id) {
    const r = await fetch(`/boards/${board}/jobs/${id}`)
    if (!r.ok) {
      return alert(await r.text())
    }
    return await r.json()
  }

  let query = ''
</script>

<a href="..">Home</a>

<h1>{board}</h1>

{#await jobs}
  <div>Loading...</div>
{:then result}
  <input type="text" bind:value="{query}" placeholder="Search">
  <button on:click={()=>query=''}>x</button>

  {#if result.length === 0}
    <div>No jobs found</div>
  {/if}

  <h2>
    Jobs
    {#if query === ''}
      ({result.length})
    {/if}
  </h2>

  {#each result as job}
    {#if query === '' || job.title?.includes(query) || job.content?.includes(query) || job?.location?.name?.includes(query)}
      <div class="jobs">
        <a href="{job.absolute_url}" target="_blank">
          {job.title}
        </a>
        <span>{job.location.name}</span>
        <span>{new Date(job.updated_at).toLocaleString()}</span>
      </div>
    {/if}
  {/each}
{:catch e}
  Error {e}
{/await}

<style>
    .jobs {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
    }

    .jobs:hover {
        background: #ffc1b9;
    }
</style>
