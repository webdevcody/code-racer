import { GitHubSocialLogin } from 'cypress-social-logins';

module.exports = (on: any, config: any) => {
  on('task', {
    GitHubSocialLogin: GitHubSocialLogin,
  });
};
