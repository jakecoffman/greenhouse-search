<script>
  import {goto} from "$app/navigation";

  let board = ''
</script>

<h1>Greenhouse Remote Job Search</h1>

<ul>
  <li>
    <a href="/github">GitHub</a>
  </li>
  <li>
    <a href="/gitlab">GitLab</a>
  </li>
  <li>
    <a href="/reddit">Reddit</a>
  </li>
  <li>
    <a href="/udacity">Udacity</a>
  </li>
  <li>
    <a href="/datadog">Datadog</a>
  </li>
  <li>
    <a href="/twitch">Twitch</a>
  </li>
  <li>
    <a href="/dropbox">DropBox</a>
  </li>
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
