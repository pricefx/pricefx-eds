async function loadJobsData() {
  try {
    const response = await fetch('https://careers.jobscore.com/jobs/pricefx/feed.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

function renderCareers() {
  const filterBy = document.createElement('div');
  filterBy.classList.add('careers-filter');
  filterBy.innerHTML = `<select class="form-control" id="filterby" name="filterBy">
      <option>Sort By</option>
      <option value="department" selected>Department</option>
      <option value="title">Title</option>
      <option value="location">Location</option>
      <option value="country">Country</option>
      <option value="city">City</option>
      <option value="state">State</option>
      <option value="date">Date</option>
  </select>`;

  const sortBy = document.createElement('div');
  sortBy.classList.add('careers-sort');
  sortBy.innerHTML = `<select class="form-control" id="sortby" name="sortby">
    <option value="" selected>A to Z</option>
    <option value="_reverse">Z to A</option>
  </select>`;
}

export default async function decorate() {
  renderCareers();
  loadJobsData();
}
