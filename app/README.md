# Easy Auth by ExWeiv Apps

This library enables you to integrate some popular OAuth options with your Wix website or with your Wix Blocks application. This package is not for basic users and designed for customization, so developers can take the skelaton and work with it to integrate the OAuth providers however they want or need.

If you are looking for something basic for your Wix site then you can install **Easy Auth** application from Wix App Market. The version in the app market is designed for basic use cases or basic users to quickly integrate providers as easy as possible.

**Currently this package handles OAuth for:**

- Facebook ✅
- Google ✅
- Discord ✅
- GitHub ✅
- Steam ✅ (Read Below)

**We are planning to add:**

- Microsoft
- Twitter
- Twitch

### Docs and Tutorials

We are on the way of creating a documentation, but it's not available right now. But we have auto-complete and TS support if you have enabled Git integration in your Wix website then you'll see integrated examples and docs with auto-completes.

Check out our YouTube Channel for tutorials.

### About Steam OAuth Process

Steam is not providing any actual oauth flow, there isn't any official API to handle auth process with Steam, instead you have openid which plays a role as another 3rd party provider to handle authentication with Steam. But main problem with that is passing state with this option is not possible. Which means a big security issue when you are dealing with auth process.

You'll have two functions, first is `redirectURL` second is `authUser` which is also possible with other providers but! issue here is as we said you can't pass a state and you won't get any token as response what you'll get is the Steam user id (a public info of any steam user) and you'll make a call to Steam web API to get the public data of user like profile photo nickname etc.

You'll need to find a way to verify logins/users like what we do with states.

---

[Kolay Gelsin](https://medium.com/the-optimists-daily/kolay-gelsin-a-turkish-expression-we-should-all-know-and-use-83fc1207ae5d) 💜

<img src="https://static.wixstatic.com/media/510eca_399a582544de4cb2b958ce934578097f~mv2.png">