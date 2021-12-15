export async function getJobs(board) {
  const r = await fetch(`/boards/${board}/jobs`)
  if (!r.ok) {
    return alert(await r.text())
  }
  let jobs = await r.json()

  // add filtering so you don't download every opening
  if (board === 'github') {
    jobs = jobs.jobs.filter(j => {
      return j.location.name.includes('US') && !j.title.includes('Manager') && j.metadata.some(m => m.value === 'Engineering')
    })
  } else if (board === 'reddit') {
    jobs = jobs.jobs.filter(j => {
      if (!j.location.name.includes('Remote')) {
        return false
      }
      return j.metadata.find(m => m.name === 'Job Family')?.value === 'Software Engineering'
    })
  } else if (board === 'datadog') {
    jobs = jobs.jobs.filter(j => {
      if (!j.location.name.includes('Remote')) {
        return false
      }
      if (j.title.includes('Manager')) {
        return false
      }
      return j.metadata.find(m => m.name === 'Cost Center')?.value?.includes('Engineering')
    })
  } else if (board === 'twitch') {
    jobs = jobs.jobs.filter(j => {
      const t = j.title
      return !t.includes('Manager') && (t.includes('Engineer') || t.includes('Software'))
    })
  } else if (board === 'dropbox') {
    jobs = jobs.jobs.filter(j => {
      if (j.title.includes('Manager')) {
        return false
      }
      if (!j.location.name.includes('US')) {
        return false
      }
      return j.metadata.find(m => m.name === 'Recruiting Team Responsible')?.value?.includes('Engineering')
    })
  } else {
    jobs = jobs.jobs
  }
  if (jobs.length > 200) {
    // don't want to make too many calls
    return jobs
  }
  // const full = await Promise.all(jobs.map(j => getJob(board, j.id)))
  return jobs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
}

export async function getJob(board, id) {
  const r = await fetch(`/boards/${board}/jobs/${id}`)
  if (!r.ok) {
    return alert(await r.text())
  }
  return await r.json()
}
