document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  const pictureInput = document.getElementById('edit-picture');
  const picturePreview = document.getElementById('picture-preview');
  const pictureError = document.getElementById('picture-error');

  if (pictureInput && picturePreview) {
    pictureInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      pictureError.classList.remove('show');

      if (file) {
        const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        if (!allowed.includes(file.type)) {
          pictureError.classList.add('show');
          pictureInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          picturePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const isValidGithubUrl = (url) => {
    return /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/.test(url);
  };

  const projectsContainer = document.getElementById('projects-container');
  const addProjectBtn = document.getElementById('addProjectBtn');
  let projectCount = projectsContainer ? projectsContainer.children.length : 0;

  const createProjectEntry = (index) => {
    const div = document.createElement('div');
    div.className = 'project-entry';
    div.dataset.index = index;
    div.innerHTML = `
      <div class="project-entry-header">
        <h4>Project ${index + 1}</h4>
        <button type="button" class="btn-remove" onclick="removeProject(this)">Remove</button>
      </div>
      <div class="form-group">
        <label>Project Title *</label>
        <input type="text" class="form-control proj-title" placeholder="e.g. Portfolio Website" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <input type="text" class="form-control proj-desc" placeholder="Short description">
      </div>
      <div class="form-group">
        <label>GitHub URL *</label>
        <input type="url" class="form-control proj-url" placeholder="https://github.com/user/repo" required>
        <div class="validation-error">Invalid GitHub URL. Format: https://github.com/username/repository</div>
      </div>
    `;
    return div;
  };

  if (addProjectBtn && projectsContainer) {
    addProjectBtn.addEventListener('click', () => {
      const entry = createProjectEntry(projectCount);
      projectsContainer.appendChild(entry);
      projectCount++;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  window.removeProject = function(btn) {
    const entry = btn.closest('.project-entry');
    if (entry) {
      entry.remove();
      const entries = projectsContainer.querySelectorAll('.project-entry');
      entries.forEach((el, i) => {
        el.dataset.index = i;
        el.querySelector('h4').textContent = `Project ${i + 1}`;
      });
      projectCount = entries.length;
    }
  };

  const editForm = document.getElementById('editForm');
  const editToast = document.getElementById('editToast');

  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      editToast.className = 'form-toast';

      const name = document.getElementById('edit-name').value.trim();
      const bio = document.getElementById('edit-bio').value.trim();

      if (!name) {
        document.getElementById('name-error').classList.add('show');
        return;
      } else {
        document.getElementById('name-error').classList.remove('show');
      }

      if (!bio) {
        document.getElementById('bio-error').classList.add('show');
        return;
      } else {
        document.getElementById('bio-error').classList.remove('show');
      }

      const projectEntries = projectsContainer.querySelectorAll('.project-entry');
      const projects = [];
      let hasError = false;

      projectEntries.forEach(entry => {
        const title = entry.querySelector('.proj-title').value.trim();
        const desc = entry.querySelector('.proj-desc').value.trim();
        const url = entry.querySelector('.proj-url').value.trim();
        const errorEl = entry.querySelector('.validation-error');

        if (!title || !url) {
          errorEl.textContent = 'Title and GitHub URL are required.';
          errorEl.classList.add('show');
          hasError = true;
          return;
        }

        if (!isValidGithubUrl(url)) {
          errorEl.textContent = 'Invalid GitHub URL. Format: https://github.com/username/repository';
          errorEl.classList.add('show');
          hasError = true;
          return;
        }

        errorEl.classList.remove('show');
        projects.push({
          title,
          description: desc,
          githubUrl: url
        });
      });

      if (hasError) return;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      formData.append('projects', JSON.stringify(projects));

      if (pictureInput && pictureInput.files[0]) {
        formData.append('picture', pictureInput.files[0]);
      }

      try {
        const res = await fetch('/api/portfolio', {
          method: 'PUT',
          body: formData
        });

        const data = await res.json();

        if (res.ok) {
          editToast.textContent = 'Portfolio updated successfully! Redirecting...';
          editToast.className = 'form-toast success';
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          editToast.textContent = data.message || 'Failed to update portfolio.';
          editToast.className = 'form-toast error';
        }
      } catch (err) {
        editToast.textContent = 'Network error. Please try again.';
        editToast.className = 'form-toast error';
      }
    });
  }
});
