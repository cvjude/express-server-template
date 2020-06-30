import express from 'express';
import 'express-async-errors';
import user from './user';

const router = express.Router();

router.get('/logout', async (req, res) => {
  await req.session.logout(res);
  successStat(res, 200, 'message', 'successfully logout');
});

router.get('/logged-in', async (req, res) => {
  try {
    await req.session.isLoggedIn(req, res);
  } catch (err) {
    return errorStat(res, 401, err.message);
  }
  successStat(res, 200, 'message', 'logged in');
});

router.use('/user', user);

export default router;
