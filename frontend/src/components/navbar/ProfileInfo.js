import Logout from "@mui/icons-material/Logout";
import SentimentSatisfiedAltTwoToneIcon from "@mui/icons-material/SentimentSatisfiedAltTwoTone";
import SpeedTwoToneIcon from "@mui/icons-material/SpeedTwoTone";
import {
	Avatar,
	Box,
	ButtonBase,
	Divider,
	Grid,
	ListItemIcon,
	Menu,
	MenuItem,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SET_LOGIN, SET_USER } from "../../redux/features/auth/authSlice";
import { getUser, logoutUser } from "../../redux/features/auth/authService";
import { useDispatch } from "react-redux";
// import { useLogoutUserMutation } from "../../features/auth/authApiSlice";
// import useAuthUser from "../../hooks/useAuthUser";

const StyledMenuItem = styled(MenuItem)({
	"&:hover": {
		backgroundColor: "#555a64",
	},
	width: 240,
	height: 50,
});

const StyledProfileDivider = styled(Divider)({
	height: "2px",
	borderColor: "#ffffff63",
});

const ProfileInfo = ({ user }) => {

	// const { isAdmin } = useAuthUser();
	const navigate = useNavigate();
    const dispatch = useDispatch();
    const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function getUserData() {
      const data = await getUser();


      setProfile(data);
      setIsLoading(false);
      await dispatch(SET_USER(data));
    //   await dispatch(SET_NAME(data.name));
    }
    getUserData();
  }, [dispatch]);

  const logout = async () => {
    await logoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/login");
  };

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleOpenUserMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseUserMenu = (event) => {
		setAnchorEl(null);
	};

	// const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

	// const handleLogout = async () => {
	// 	try {
	// 		await logoutUser().unwrap();
	// 		navigate("/login");
	// 	} catch (err) {
	// 		toast.error(err);
	// 	}
	// };

	// useEffect(() => {
	// 	if (isSuccess) {
	// 		const message = data?.message;
	// 		toast.success(message);
	// 	}
	// }, [isSuccess, data]);

	return (
		<Box sx={{ flexShrink: 0, ml: 0.75 }}>
			<ButtonBase
				sx={{
					p: 0.25,
					bgColor: open ? "#E0E0E0" : "transparent",
					borderRadius: 10,
					"&:hover": { bgcolor: "#555a64" },
				}}
				aria-label="open profile"
				ref={anchorEl}
				aria-controls={open ? "profile-grow" : undefined}
				aria-haspopup="true"
				onClick={handleOpenUserMenu}
			>
				{profile?.photo ? (
					<Stack
						direction="row"
						spacing={2}
						alignItems="center"
						sx={{ p: 0.5 }}
					>
						<Avatar
							alt="profile user"
							src={profile?.photo}
							sx={{ width: 48, height: 48 }}
						/>
						<Typography variant="h6">{profile?.firstName}</Typography>
					</Stack>
				) : (
					<Stack
						direction="row"
						spacing={2}
						alignItems="center"
						sx={{ p: 0.5 }}
					>
						<Avatar sx={{ bgcolor: deepOrange[700] }}>
							{profile?.firstName.charAt(0).toUpperCase()}
						</Avatar>
						<Typography variant="h6">{profile?.firstName}</Typography>
					</Stack>
				)}
			</ButtonBase>

			{/* Menu Items */}
			<Menu
				sx={{ mt: "45px" }}
				id="account-menu"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={open}
				onClose={handleCloseUserMenu}
				onClick={handleCloseUserMenu}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						bgcolor: "#000000",
						color: "#ffffff",
						borderRadius: "10px",

						"& .MuiAvatar-root": {
							width: 43,
							height: 42,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "#000000",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}
			>
				<Box>
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
					>
						<Stack>
							{/* profile menu item */}
							<StyledMenuItem
								onClick={() => navigate("/profile")}
							>
								<Grid item>
									<Stack
										direction="row"
										spacing={1.25}
										alignItems="center"
									>
										{profile?.photo ? (
											<Stack
												direction="row"
												spacing={1.25}
												alignItems="center"
												sx={{ p: 0.5 }}
											>
												<Avatar
													alt="profile user"
													src={profile?.photo}
													sx={{
														width: 48,
														height: 48,
													}}
												/>
												<Stack>
													<Typography variant="h6">
														{profile?.firstName}{" "}
														{profile?.lastName}
													</Typography>
													<Typography variant="body2">
														{/* {isAdmin
															? "Project Admin"
															: "Product User"} */}
													</Typography>
												</Stack>
											</Stack>
										) : (
											<Stack
												direction="row"
												spacing={1.25}
												alignItems="center"
												sx={{ p: 0.5 }}
											>
												<Avatar
													sx={{
														bgcolor:
															deepOrange[700],
													}}
												>
													{profile?.firstName
														.charAt(0)
														.toUpperCase()}
												</Avatar>
												<Stack>
													<Typography variant="h6">
														{profile?.firstName}{" "}
														{profile?.lastName}
													</Typography>
													<Typography
														variant="body2"
														color="#CFD8DC"
													>
														{/* {isAdmin
															? "Project Admin"
															: "Product User"} */}
													</Typography>
												</Stack>
											</Stack>
										)}
									</Stack>
								</Grid>
							</StyledMenuItem>
							<StyledProfileDivider />

							{/* view profile */}
							<StyledMenuItem
								onClick={() => navigate("/profile")}
							>
								<Grid item>
									<Stack
										direction="row"
										alignItems="center"
										spacing={2}
									>
										<ListItemIcon>
											<SentimentSatisfiedAltTwoToneIcon
												color="blue"
												sx={{ fontSize: 45 }}
											/>
										</ListItemIcon>
										<Typography variant="h6">
											View Profile
										</Typography>
									</Stack>
								</Grid>
							</StyledMenuItem>
							<StyledProfileDivider />
							{/* Dashboard */}
							{/*<StyledMenuItem
								onClick={() => navigate("/dashboard")}
							>
								<Grid item>
									<Stack
										direction="row"
										alignItems="center"
										spacing={2}
									>
										<ListItemIcon>
											<SpeedTwoToneIcon
												color="yellow"
												sx={{ fontSize: 45 }}
											/>
										</ListItemIcon>
										<Typography variant="h6">
											Dashboard
										</Typography>
									</Stack>
								</Grid>
							</StyledMenuItem>*/}
							<StyledProfileDivider />

							{/* logout */}
							<StyledMenuItem onClick={logout}>
								<Grid item>
									<Stack
										direction="row"
										alignItems="center"
										spacing={2}
									>
										<ListItemIcon>
											<Logout
												color="green"
												sx={{ fontSize: 45 }}
											/>
										</ListItemIcon>
										<Typography variant="h6">
											Logout
										</Typography>
									</Stack>
								</Grid>
							</StyledMenuItem>
						</Stack>
					</Grid>
					<Divider />
				</Box>
			</Menu>
		</Box>
	);
};

export default ProfileInfo;