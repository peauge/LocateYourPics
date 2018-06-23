import alt from '../alt';

export default alt.generateActions('getMyProfile', 'getMyProfileError', 'getMyProfileSuccess',
																	 'getProfile', 'getProfileError', 'getProfileSuccess',
								   								 'editProfile', 'editProfileError', 'editProfileSuccess',
									 							 	 /*'editPhoto',*/ 'editPhotoError', 'editPhotoSuccess',
																	 'getAvatar', 'getAvatarError', 'getAvatarSuccess',
								   						 		 'invalidateProfile',
																	 'alertGuideDismiss', 'invalidateProfile', 'updateAway');
