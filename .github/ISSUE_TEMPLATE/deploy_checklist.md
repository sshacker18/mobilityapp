---
name: Deploy Checklist
about: Steps to verify before making the repository public or deploying
---

# Deployment checklist

- [ ] Verify that no secrets (.env, .env.local) are committed.
- [ ] Ensure `JWT_SECRET` is not the default and is rotated before production.
- [ ] Confirm CORS origins and allowed hosts are set correctly in the backend.
- [ ] Verify database credentials and access controls.
- [ ] Review code for any debugging/test-only endpoints and remove or protect them.
- [ ] Add monitoring and alerting for production deployments.
