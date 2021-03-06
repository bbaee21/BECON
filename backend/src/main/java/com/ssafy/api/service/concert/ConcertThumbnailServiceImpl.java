package com.ssafy.api.service.concert;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.api.request.ConcertThumbnailPostReq;
import com.ssafy.common.util.MD5Generator;
import com.ssafy.db.entity.ConcertThumbnail;
import com.ssafy.db.repository.ConcertThumbnailRepository;

@Service("concertThumbnailService")
public class ConcertThumbnailServiceImpl implements ConcertThumbnailService {
	@Autowired
	ConcertThumbnailRepository concertThumbnailRepository;

	@Transactional
	@Override
	public ConcertThumbnail saveFile(ConcertThumbnailPostReq request) {
		return concertThumbnailRepository.save(request.toEntity());
	}

	@Override
	public ConcertThumbnailPostReq setFile(MultipartFile files)
			throws UnsupportedEncodingException, NoSuchAlgorithmException,
			IllegalStateException, IOException {
		ConcertThumbnailPostReq concertThumbnailInfo = null;
		String origFilename = files.getOriginalFilename();
		String filename = new MD5Generator(origFilename).toString();
		
		String savePath = "/images/thumbnail";
		
		String filePath = savePath + "/" + origFilename;
		files.transferTo(new File(filePath));
		
		concertThumbnailInfo = new ConcertThumbnailPostReq();
		concertThumbnailInfo.setOriginName(origFilename);  
		concertThumbnailInfo.setName(filename);
		concertThumbnailInfo.setPath(filePath);

		return concertThumbnailInfo;
	}
}
