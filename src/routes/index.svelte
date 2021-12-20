<script>
  import {goto} from "$app/navigation";

  let board = ''

  const entries = [
      'coinbase',
      'gemini',
      'ramp',
      'socure',
      'benchling',
      'vercel',
      'hashicorp',
      'github',
      'gitlab',
      'reddit',
      'udacity',
      'datadog',
      'twitch',
      'dropbox'
  ].sort()
</script>

<h1>Greenhouse Remote Job Search</h1>

<ul>
  {#each entries as entry}
  <li>
    <a href="/{entry}">{entry}</a>
  </li>
  {/each}
  <li>
    <input type="text" bind:value={board} placeholder="custom" on:keypress={e => e.charCode === 13 ? goto(`/${board}`) : undefined}>
    <button on:click={goto(`/${board}`)}>
      View Custom
    </button>
  </li>
</ul>

<style>
  li {
      margin-bottom: .5rem;
  }
</style>
