import { FACEBOOK, TWITTER, PINTEREST, LINKEDIN } from '../../scripts/constants.js';

async function loadJobsData(sortBy, filterBy, block) {
  try {
    const response = await fetch(`https://careers.jobscore.com/jobs/pricefx/feed.json?sort=${filterBy}${sortBy}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const jobScore = await response.json();

    const { jobs } = jobScore;
    const departments = [];
    document.querySelector('.careers-postings-container')?.remove();
    const jobPosting = document.createElement('div');
    jobPosting.classList.add('careers-postings-container');

    jobs.forEach((job) => {
      const departmentName = job.department;
      const departmentID = departmentName.replace(/[^a-zA-Z0-9]/g, '_');

      if (departments.indexOf(departmentName) === -1) {
        departments.push(departmentName);
        const departmentDiv = document.createElement('div');
        departmentDiv.classList.add('careers-postings');
        departmentDiv.innerHTML = `<h3><strong>${departmentName}</strong></h3>
        <div class="careers-content-container">
        <ul id="${departmentID}">
          <li class="job-item">                        
            <div class="job-container">                                 
              <div class="job-header">                                   
              <h3>${job.title}</h3>   
              <p>${job.city + job.state} - ${job.country}</p>
              </div>                                   
              <div class="job-details" data-expanded="false">${job.description}                                     
                <a href="${job.detail_url}" target="_blank" class="button primary">Apply Now</a>                                 
                <div class="careers-social-links">
                  <a class="button-facebook" target="_blank" href="/#facebook">${FACEBOOK}</a>
                  <a class="button-twitter" target="_blank" href="/#twitter">${TWITTER}</a>
                  <a class="button-linkedin" target="_blank" href="/#linkedin">${LINKEDIN}</a>
                  <a class="button-pinterest" target="_blank" href="/#pinterest">${PINTEREST}</a>        
                </div>
              </div>
            </div>                      
          </li>
        </ul>
        </div>`;
        jobPosting.append(departmentDiv);
        block.append(jobPosting);
      }
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('.job-header');
      if (target) {
        const targetParent = target.parentElement.parentElement;
        targetParent.classList.toggle('active');
        if (targetParent.classList.contains('active')) {
          target.nextElementSibling.setAttribute('data-expanded', 'true');
        } else {
          target.nextElementSibling.setAttribute('data-expanded', 'false');
        }
      }
    });
  } catch (error) {
    error.log(error);
  }
}

function renderCareers(block) {
  const joinTeam = document.createElement('h2');
  joinTeam.classList.add('careers-join-team');
  const careersDropdown = document.createElement('div');
  careersDropdown.classList.add('careers-select');
  const filterBy = document.createElement('div');
  filterBy.classList.add('careers-filter');
  filterBy.innerHTML = `<select class="form-control" id="filterby" name="filterBy">
      <option>- Choose an Option -</option>
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
    <option>- Choose an Option -</option>
    <option value="" selected>A to Z</option>
    <option value="_reverse">Z to A</option>
  </select>`;
  joinTeam.innerHTML = `<strong>Join Our Team</strong>`;
  block.append(joinTeam);
  careersDropdown.append(filterBy);
  careersDropdown.append(sortBy);
  block.append(careersDropdown);
}

export default async function decorate(block) {
  renderCareers(block);
  loadJobsData('deparment', '', block);
  document.addEventListener('change', (e) => {
    const targetSort = e.target.closest('#sortby');
    const targetFilter = e.target.closest('#filterby');
    let sortBy = document.querySelector('#sortby').value;
    let filterBy = document.querySelector('#filterby').value;
    if (targetSort) {
      sortBy = targetSort.value;
    }
    if (targetFilter) {
      filterBy = targetFilter.value;
    }
    loadJobsData(sortBy, filterBy, block);
  });
}
