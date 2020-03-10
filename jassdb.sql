
-- Database jassdb

USE [master]
GO

/****** Object:  Database [jassdb]    Script Date: 03.03.2020 13:15:26 ******/
CREATE DATABASE [jassdb]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'jassdb', FILENAME = N'/var/opt/mssql/data/jassdb.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'jassdb_log', FILENAME = N'/var/opt/mssql/data/jassdb_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [jassdb].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [jassdb] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [jassdb] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [jassdb] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [jassdb] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [jassdb] SET ARITHABORT OFF 
GO

ALTER DATABASE [jassdb] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [jassdb] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [jassdb] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [jassdb] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [jassdb] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [jassdb] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [jassdb] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [jassdb] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [jassdb] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [jassdb] SET  ENABLE_BROKER 
GO

ALTER DATABASE [jassdb] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [jassdb] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [jassdb] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [jassdb] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [jassdb] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [jassdb] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [jassdb] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [jassdb] SET RECOVERY FULL 
GO

ALTER DATABASE [jassdb] SET  MULTI_USER 
GO

ALTER DATABASE [jassdb] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [jassdb] SET DB_CHAINING OFF 
GO

ALTER DATABASE [jassdb] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO

ALTER DATABASE [jassdb] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO

ALTER DATABASE [jassdb] SET DELAYED_DURABILITY = DISABLED 
GO

ALTER DATABASE [jassdb] SET QUERY_STORE = OFF
GO

ALTER DATABASE [jassdb] SET  READ_WRITE 
GO

-- tables

USE [jassdb]
GO

/****** Object:  Table [dbo].[Game]    Script Date: 03.03.2020 13:17:35 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- table User

CREATE TABLE [dbo].[User](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](100) NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


-- table Game

CREATE TABLE [dbo].[Game](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[CreatedBy] [int] NOT NULL,
 CONSTRAINT [PK_Game] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- table Trumpf

CREATE TABLE [dbo].[Trumpf](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](30) NOT NULL,
	[Multiplier] [int] NOT NULL,
 CONSTRAINT [PK_Trumpf] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- table Round

CREATE TABLE [dbo].[Round](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Trumpf] [int] NOT NULL,
	[Game] [int] NOT NULL,
 CONSTRAINT [PK_Round] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Round]  WITH CHECK ADD  CONSTRAINT [FK_Round_Game] FOREIGN KEY([Game])
REFERENCES [dbo].[Game] ([id])
GO

ALTER TABLE [dbo].[Round] CHECK CONSTRAINT [FK_Round_Game]
GO

ALTER TABLE [dbo].[Round]  WITH CHECK ADD  CONSTRAINT [FK_Round_Trumpf] FOREIGN KEY([Trumpf])
REFERENCES [dbo].[Trumpf] ([id])
GO

ALTER TABLE [dbo].[Round] CHECK CONSTRAINT [FK_Round_Trumpf]
GO

-- table Team

CREATE TABLE [dbo].[Team](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[Hundreds] [int] NOT NULL,
	[Fifties] [int] NOT NULL,
	[Twenties] [int] NOT NULL,
	[Rest] [int] NOT NULL,
	[Game] [int] NULL,
 CONSTRAINT [PK_Team] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Team]  WITH CHECK ADD  CONSTRAINT [FK_Team_Game] FOREIGN KEY([Game])
REFERENCES [dbo].[Game] ([id])
GO

ALTER TABLE [dbo].[Team] CHECK CONSTRAINT [FK_Team_Game]
GO

ALTER TABLE [dbo].[Game]  WITH CHECK ADD  CONSTRAINT [FK_Game_User] FOREIGN KEY([id])
REFERENCES [dbo].[User] ([id])
GO

ALTER TABLE [dbo].[Game] CHECK CONSTRAINT [FK_Game_User]
GO

-- table PointsPerTeamPerRound

CREATE TABLE [dbo].[PointsPerTeamPerRound](
	[Round] [int] NOT NULL,
	[Team] [int] NOT NULL,
	[WiisPoints] [int] NULL,
	[Points] [int] NOT NULL,
 CONSTRAINT [PK_PointsPerTeamPerRound] PRIMARY KEY CLUSTERED 
(
	[Team] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[PointsPerTeamPerRound]  WITH CHECK ADD  CONSTRAINT [FK_PointsPerTeamPerRound_Round] FOREIGN KEY([Round])
REFERENCES [dbo].[Round] ([id])
GO

ALTER TABLE [dbo].[PointsPerTeamPerRound] CHECK CONSTRAINT [FK_PointsPerTeamPerRound_Round]
GO

ALTER TABLE [dbo].[PointsPerTeamPerRound]  WITH CHECK ADD  CONSTRAINT [FK_PointsPerTeamPerRound_Team] FOREIGN KEY([Team])
REFERENCES [dbo].[Team] ([id])
GO

ALTER TABLE [dbo].[PointsPerTeamPerRound] CHECK CONSTRAINT [FK_PointsPerTeamPerRound_Team]
GO

-- end